import numpy as np
import pandas as pd
import json
import os
from collections import Counter
from scipy.stats import poisson
import warnings
warnings.filterwarnings("ignore")

# ==================== 全局常量（大乐透核心理论，基于2800期历史统计）====================
N_FRONT, N_BACK = 35, 12
ROLLING_WINDOW = 200
MC_SAMPLES = 5000
# 核心理论阈值（官方历史统计）
MIN_SUM, MAX_SUM = 78, 112       # 90%开奖和值区间
ODD_RATIOS = {(2,3), (3,2)}      # 85%开奖奇偶比
ZONE_RATIOS = {(1,2,2), (2,1,2), (2,2,1)}  # 80%开奖三区比
MAX_CONSECUTIVE = 2              # 90%开奖连号≤2
MIN_COLD_OMISSION = 10           # 每期至少1个冷号（遗漏≥10期）
# 模型配置
MODEL_NAMES = ["频率", "遗漏", "贝叶斯", "马尔可夫", "关联矩阵", "趋势", "周期", "结构"]
BASE_WEIGHT = 0.05               # 基础权重
FREEZE_WEIGHT = 0.02             # 冷冻权重（淘汰区）
MAX_WEIGHT = 0.3                 # 最高权重
HIT_HISTORY_LEN = 5              # 连续命中统计长度

# ==================== 大乐透理论校验（核心门槛）====================
class DLTTheory:
    @staticmethod
    def validate(nums_front):
        """返回：是否合规(bool)，结构分(0-1)，违规原因(list)"""
        if len(nums_front) != 5:
            return False, 0, ["号码数量错误"]
        nums = sorted(nums_front)
        reasons = []
        score = 0

        # 1. 和值校验
        s = sum(nums)
        if not MIN_SUM <= s <= MAX_SUM:
            reasons.append(f"和值{s}超出[{MIN_SUM},{MAX_SUM}]区间")
        else:
            score += 0.3 * np.exp(-0.5 * ((s - 90) / 12) ** 2)  # 90为历史平均和值

        # 2. 奇偶校验
        odd = sum(1 for n in nums if n % 2 != 0)
        if (odd, 5-odd) not in ODD_RATIOS:
            reasons.append(f"奇偶比{odd}:{5-odd}不符合历史规律")
        else:
            score += 0.2

        # 3. 三区校验
        z1 = sum(1 for n in nums if 1 <= n <= 12)
        z2 = sum(1 for n in nums if 13 <= n <= 24)
        z3 = sum(1 for n in nums if 25 <= n <= 35)
        if (z1, z2, z3) not in ZONE_RATIOS:
            reasons.append(f"三区比{z1}:{z2}:{z3}不符合历史规律")
        else:
            score += 0.2

        # 4. 连号校验
        consecutive = sum(1 for i in range(4) if nums[i+1] - nums[i] == 1)
        if consecutive > MAX_CONSECUTIVE:
            reasons.append(f"连号{consecutive}组超出上限{MAX_CONSECUTIVE}")
        else:
            score += 0.1

        # 5. 冷号校验（至少1个遗漏≥10期的号）
        # 注意：这里需要从外部传入当前遗漏值，后续在ModelEnsemble中调用
        return len(reasons) == 0, min(1.0, score), reasons

# ==================== 记忆管理（含淘汰+动态权重）====================
class MemoryManager:
    def __init__(self, data_path="data.csv"):
        self.data_path = data_path
        self.memory_path = "ai_memory.json"
        self.df = self._load_full_data()
        self.memory = self._load_or_init_memory()

    def _load_full_data(self):
        cols = ['issue','date','f1','f2','f3','f4','f5','b1','b2']
        df = pd.read_csv(self.data_path, header=0, names=cols, usecols=range(9))
        df['front'] = df[['f1','f2','f3','f4','f5']].apply(lambda x: sorted(x.tolist()), axis=1)
        df['back'] = df[['b1','b2']].apply(lambda x: sorted(x.tolist()), axis=1)
        return df

    def _load_or_init_memory(self):
        if os.path.exists(self.memory_path):
            with open(self.memory_path, "r") as f:
                mem = json.load(f)
                # 兼容旧版本，补充缺失字段
                if "model_hit_history" not in mem:
                    mem["model_hit_history"] = {name: [] for name in MODEL_NAMES}
                if "model_top20" not in mem:
                    mem["model_top20"] = {name: [] for name in MODEL_NAMES}
                return mem
        return self._pretrain()

    def _pretrain(self):
        print("首次运行：执行2800期全量预训练...")
        df = self.df
        hist_front = df['front'].tolist()
        hist_back = df['back'].tolist()
        flat_front = [n for draw in hist_front for n in draw]
        flat_back = [n for draw in hist_back for n in draw]
        
        self.freq_front = Counter(flat_front)
        self.freq_back = Counter(flat_back)
        
        # 初始权重：基于2800期回测命中率分配
        base_weights = {
            "频率": 0.14, "遗漏": 0.16, "贝叶斯": 0.12, "马尔可夫": 0.15,
            "关联矩阵": 0.11, "趋势": 0.14, "周期": 0.1, "结构": 0.08
        }
        total = sum(base_weights.values())
        weights = {k: v/total for k,v in base_weights.items()}

        memory = {
            "weights": weights,
            "rolling_front": hist_front[-ROLLING_WINDOW:],
            "rolling_back": hist_back[-ROLLING_WINDOW:],
            "total_issues": len(df),
            "freq_front": {str(k):v for k,v in self.freq_front.items()},
            "freq_back": {str(k):v for k,v in self.freq_back.items()},
            "history_hits": [],
            "model_hit_history": {name: [] for name in MODEL_NAMES},  # 连续命中记录
            "model_top20": {name: [] for name in MODEL_NAMES}         # 各模型当期Top20
        }
        with open(self.memory_path, "w") as f:
            json.dump(memory, f)
        print("预训练完成！")
        return memory

    def update_rolling_window(self, new_front, new_back):
        self.memory["rolling_front"].append(new_front)
        self.memory["rolling_back"].append(new_back)
        if len(self.memory["rolling_front"]) > ROLLING_WINDOW:
            self.memory["rolling_front"].pop(0)
            self.memory["rolling_back"].pop(0)

    def update_weights_and_hits(self, hit_counts):
        """更新权重+命中历史+淘汰机制"""
        # 1. 更新连续命中历史
        for name in MODEL_NAMES:
            self.memory["model_hit_history"][name].append(hit_counts[name])
            if len(self.memory["model_hit_history"][name]) > HIT_HISTORY_LEN:
                self.memory["model_hit_history"][name].pop(0)
        
        # 2. 淘汰机制判断
        for name in MODEL_NAMES:
            hit_hist = self.memory["model_hit_history"][name]
            current_weight = self.memory["weights"][name]
            # 连续5期命中≤0 → 冷冻
            if len(hit_hist) >= HIT_HISTORY_LEN and sum(hit_hist) <= 0:
                self.memory["weights"][name] = FREEZE_WEIGHT
                print(f"⚠️ 模型[{name}]连续5期命中≤0，已冻结至{FREEZE_WEIGHT}")
            # 连续2期命中≥1 → 解冻
            elif len(hit_hist) >= 2 and sum(hit_hist[-2:]) >= 1 and current_weight == FREEZE_WEIGHT:
                self.memory["weights"][name] = BASE_WEIGHT
                print(f"✅ 模型[{name}]连续2期命中≥1，已解冻至{BASE_WEIGHT}")
            # 连续3期权重<0.07 → 衰减10%
            elif len(hit_hist) >= 3 and current_weight < 0.07:
                self.memory["weights"][name] *= 0.9
                print(f"📉 模型[{name}]权重连续偏低，衰减至{self.memory['weights'][name]:.3f}")

        # 3. 自适应动态权重更新
        total_hits = sum(hit_counts.values())
        lr = 0.05 if total_hits >= 3 else 0.2  # 自适应学习率
        current_weights = np.array([self.memory["weights"][name] for name in MODEL_NAMES])
        hit_rates = np.array([hit_counts[name]/5 for name in MODEL_NAMES])
        target = hit_rates / (hit_rates.sum() + 1e-9)
        new_weights = current_weights + lr * (target - current_weights)
        # 限制权重范围
        new_weights = np.clip(new_weights, FREEZE_WEIGHT, MAX_WEIGHT)
        new_weights /= new_weights.sum()  # 归一化
        for i, name in enumerate(MODEL_NAMES):
            self.memory["weights"][name] = float(new_weights[i])

    def save_memory(self):
        # 熔断：保留最近1000条历史，防止文件过大
        if len(self.memory["history_hits"]) > 1000:
            self.memory["history_hits"] = self.memory["history_hits"][-1000:]
        with open(self.memory_path, "w") as f:
            json.dump(self.memory, f, indent=2)

# ==================== 8大模型集成 ====================
class ModelEnsemble:
    def __init__(self, memory_manager):
        self.mem_mgr = memory_manager
        self.theory = DLTTheory()
        self.rolling_front = memory_manager.memory["rolling_front"]
        self.rolling_back = memory_manager.memory["rolling_back"]

    def _get_omission(self):
        """获取当前前区遗漏值（每个号距上次出现的期数）"""
        last_seen = np.full(N_FRONT, -1)
        for idx, draw in enumerate(reversed(self.rolling_front)):
            for n in draw:
                if last_seen[n-1] == -1:
                    last_seen[n-1] = idx
        return np.where(last_seen == -1, len(self.rolling_front), last_seen)

    def _model_freq(self):
        """1. 频率模型（长期2800期+短期200期融合）"""
        long_freq = np.array([self.mem_mgr.memory["freq_front"].get(str(i+1), 0) for i in range(N_FRONT)])
        short_counts = np.array([n for draw in self.rolling_front for n in draw].count(i+1) for i in range(N_FRONT))
        return 0.3 * (long_freq / long_freq.sum()) + 0.7 * (short_counts / (short_counts.sum() + 1e-9))

    def _model_omission(self):
        """2. 遗漏模型（冷号回补，泊松分布）"""
        omission = self._get_omission()
        lam = N_FRONT / 5
        return (lam ** omission) * np.exp(-lam) + 1e-9

    def _model_bayes(self):
        """3. 贝叶斯模型（后验概率）"""
        alpha = 1
        total = len(self.rolling_front)
        flat = [n for draw in self.rolling_front for n in draw]
        counts = Counter(flat)
        hits = np.array([counts.get(i+1, 0) for i in range(N_FRONT)])
        return (alpha + hits) / (alpha + total)

    def _model_markov(self):
        """4. 马尔可夫模型（状态转移，最近50期）"""
        recent = self.rolling_front[-50:]
        T = np.zeros((N_FRONT, N_FRONT))
        for draw in recent:
            for i in range(5):
                for j in range(i+1, 5):
                    a, b = draw[i]-1, draw[j]-1
                    T[a, b] += 1
                    T[b, a] += 1
        row_sum = T.sum(axis=1, keepdims=True)
        T_norm = np.divide(T, row_sum, out=np.zeros_like(T), where=row_sum!=0)
        last_draw = recent[-1]
        return T_norm[last_draw[0]-1] + 1e-9

    def _model_matrix(self):
        """5. 关联矩阵模型（共现概率）"""
        recent = self.rolling_front[-50:]
        Co = np.zeros((N_FRONT, N_FRONT))
        for draw in recent:
            for i in range(5):
                for j in range(i+1, 5):
                    a, b = draw[i]-1, draw[j]-1
                    Co[a, b] += 1
                    Co[b, a] += 1
        last = recent[-1]
        score = np.zeros(N_FRONT)
        for i in range(N_FRONT):
            for j in last:
                score[i] += Co[i, j-1]
        return score / (score.max() + 1e-9)

    def _model_trend(self):
        """6. 趋势模型（EMA指数移动平均）"""
        recent = self.rolling_front[-50:]
        series = np.zeros((len(recent), N_FRONT))
        for idx, draw in enumerate(recent):
            for n in draw:
                series[idx, n-1] = 1
        ema = np.zeros(N_FRONT)
        alpha = 0.15
        for t in range(len(series)):
            ema = alpha * series[t] + (1-alpha) * ema
        return ema

    def _model_cycle(self):
        """7. 周期模型（相位差检测）"""
        score = np.zeros(N_FRONT)
        for num in range(1, N_FRONT+1):
            idx = [i for i, draw in enumerate(self.rolling_front) if num in draw]
            if len(idx) > 2:
                period = np.mean(np.diff(idx))
                if period > 0:
                    phase = idx[-1] % period
                    diff = abs((len(self.rolling_front)-1) % period - phase)
                    score[num-1] = 1 / (diff + 1e-9)
        return score

    def _model_struct(self):
        """8. 结构模型（理论约束评分）"""
        score = np.zeros(N_FRONT)
        omission = self._get_omission()
        cold_nums = set(np.where(omission >= MIN_COLD_OMISSION)[0] + 1)  # 冷号集合
        for num in range(1, N_FRONT+1):
            temp = []
            for _ in range(20):
                others = np.random.choice([i for i in range(1, N_FRONT+1) if i != num], 4, replace=False)
                sample = sorted(list(others) + [num])
                valid, struct_score, _ = self.theory.validate(sample)
                if valid:
                    # 优先选含冷号的组合
                    if num in cold_nums:
                        temp.append(struct_score * 1.2)
                    else:
                        temp.append(struct_score)
            score[num-1] = np.mean(temp) if temp else 0
        return score / (score.max() + 1e-9)

    def predict_front(self):
        """前区预测：融合8大模型，返回概率+各模型Top20"""
        models = {
            "频率": self._model_freq(), "遗漏": self._model_omission(),
            "贝叶斯": self._model_bayes(), "马尔可夫": self._model_markov(),
            "关联矩阵": self._model_matrix(), "趋势": self._model_trend(),
            "周期": self._model_cycle(), "结构": self._model_struct()
        }
        # 按动态权重融合
        weights = np.array([self.mem_mgr.memory["weights"][name] for name in MODEL_NAMES])
        final = np.zeros(N_FRONT)
        for i, (name, vec) in enumerate(models.items()):
            vec_norm = (vec - vec.min()) / (vec.max() - vec.min() + 1e-9)
            final += vec_norm * weights[i]
            # 保存各模型Top20，用于后续命中计算
            top20_idx = np.argsort(vec_norm)[-20:] + 1
            self.mem_mgr.memory["model_top20"][name] = top20_idx.tolist()
        return final / final.sum(), models

    def predict_back(self):
        """后区预测（独立建模，不依赖前区）"""
        flat = [n for draw in self.rolling_back for n in draw]
        freq = np.array([flat.count(i+1) for i in range(N_BACK)])
        last_seen = np.full(N_BACK, -1)
        for idx, draw in enumerate(reversed(self.rolling_back)):
            for n in draw:
                if last_seen[n-1] == -1:
                    last_seen[n-1] = idx
        omission = np.where(last_seen == -1, len(self.rolling_back), last_seen)
        lam = N_BACK / 2
        omit_score = (lam ** omission) * np.exp(-lam) + 1e-9
        if freq.sum() == 0:
            return np.ones(N_BACK) / N_BACK
        return 0.6 * (freq / freq.sum()) + 0.4 * (omit_score / omit_score.sum())

# ==================== 智能蒙特卡罗+反人类Top3生成 ====================
class MonteCarloSampler:
    def __init__(self, model_ensemble, memory_manager):
        self.model = model_ensemble
        self.mem_mgr = memory_manager
        self.theory = DLTTheory()
        self.omission = self.model._get_omission()
        self.cold_nums = set(np.where(self.omission >= MIN_COLD_OMISSION)[0] + 1)  # 冷号集合

    def _calc_crowd_score(self, combo):
        """计算组合拥挤度：热号占比越高，拥挤度越高（大众越爱选）"""
        recent_hot = set()
        flat_recent = [n for draw in self.mem_mgr.memory["rolling_front"][-20:] for n in draw]
        for num in range(1, N_FRONT+1):
            if flat_recent.count(num) >= 3:  # 最近20期出现≥3次为热号
                recent_hot.add(num)
        hot_ratio = len(set(combo) & recent_hot) / 5
        return hot_ratio  # 0-1，越高越拥挤

    def sample_front(self):
        """前区采样：反人类逻辑，避开高拥挤度组合"""
        scores, models = self.model.predict_front()
        top50_idx = np.argsort(scores)[-50:]  # 扩大候选池到50
        top50_probs = scores[top50_idx] / scores[top50_idx].sum()
        results = Counter()
        for _ in range(MC_SAMPLES):
            # 从Top50按权重采样
            sample_idx = np.random.choice(top50_idx, 5, replace=False, p=top50_probs)
            sample = sorted(sample_idx + 1)
            # 1. 核心理论校验
            valid, struct_score, _ = self.theory.validate(sample)
            if not valid:
                continue
            # 2. 反人类过滤：拥挤度≥0.8（热号占比≥80%）的直接丢弃
            crowd_score = self._calc_crowd_score(sample)
            if crowd_score >= 0.8:
                continue
            # 3. 冷号校验：至少1个冷号
            if len(set(sample) & self.cold_nums) < 1:
                continue
            # 加权计数：结构分越高、拥挤度越低，权重越高
            weight = struct_score * (1 - crowd_score)
            results[tuple(sample)] += weight
        # 取频次最高的3组，作为Top3
        return results.most_common(3), models

    def sample_back(self):
        """后区采样"""
        scores = self.model.predict_back()
        results = Counter()
        for _ in range(1000):
            sample_idx = np.random.choice(N_BACK, 2, replace=False, p=scores/scores.sum())
            sample = sorted(sample_idx + 1)
            results[tuple(sample)] += 1
        return results.most_common(1)[0][0]

# ==================== 对外接口 ====================
def load_data():
    return MemoryManager()

def get_ai_prediction(mem_mgr):
    """生成预测，返回Top3+三维置信度+各模型Top20"""
    ensemble = ModelEnsemble(mem_mgr)
    sampler = MonteCarloSampler(ensemble, mem_mgr)
    (front_top3, models), back_best = sampler.sample_front(), sampler.sample_back()
    predictions = []
    omission = ensemble._get_omission()
    for (front, freq_weight) in front_top3:
        # 三维置信度计算
        # 1. 蒙特卡罗频次占比（40%）
        mc_conf = freq_weight / MC_SAMPLES
        # 2. 结构合规分（30%）
        _, struct_conf, _ = DLTTheory.validate(list(front))
        # 3. 模型共识度（30%）：各模型对该组合的评分方差，方差越小共识越高
        model_scores = []
        for name in MODEL_NAMES:
            vec = models[name]
            vec_norm = (vec - vec.min()) / (vec.max() - vec.min() + 1e-9)
            score = vec_norm[np.array(front)-1].mean()
            model_scores.append(score)
        consensus_conf = 1 - np.var(model_scores)  # 方差越小，共识度越高
        # 总置信度
        total_conf = 0.4*mc_conf + 0.3*struct_conf + 0.3*consensus_conf
        # 冷号数量
        cold_cnt = len(set(front) & set(np.where(omission >= MIN_COLD_OMISSION)[0] + 1))
        predictions.append({
            "front": list(front), "back": list(back_best),
            "confidence": round(total_conf, 4),
            "mc_conf": round(mc_conf, 4), "struct_conf": round(struct_conf, 4), "consensus_conf": round(consensus_conf, 4),
            "cold_cnt": cold_cnt, "crowd_score": round(sampler._calc_crowd_score(front), 4)
        })
    # 保存各模型Top20到memory，用于反馈计算命中
    mem_mgr.memory["current_top20"] = {name: ensemble.mem_mgr.memory["model_top20"][name] for name in MODEL_NAMES}
    mem_mgr.save_memory()
    return predictions

def feedback_learning(mem_mgr, issue, real_front, real_back):
    """反馈学习：计算真实命中数，更新权重"""
    # 1. 计算各模型真实命中数（对比模型Top20和真实开奖号）
    hit_counts = {}
    current_top20 = mem_mgr.memory.get("current_top20", {})
    real_set = set(real_front)
    for name in MODEL_NAMES:
        top20 = set(current_top20.get(name, []))
        hit_counts[name] = len(top20 & real_set)
    # 2. 更新滚动窗口+权重+淘汰机制
    mem_mgr.update_rolling_window(real_front, real_back)
    mem_mgr.update_weights_and_hits(hit_counts)
    # 3. 保存历史
    mem_mgr.memory["history_hits"].append({
        "issue": issue, "real_front": real_front, "real_back": real_back,
        "hit_counts": hit_counts, "weights_after": mem_mgr.memory["weights"].copy()
    })
    mem_mgr.save_memory()
    return hit_counts, mem_mgr.memory["weights"]
