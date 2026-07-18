import numpy as np
import pandas as pd
import json
import os
from collections import Counter
from scipy.stats import poisson

# ==================== 全局常量 ====================
N_FRONT, N_BACK = 35, 12
ROLLING_WINDOW = 200
MC_SAMPLES = 5000
MIN_SUM, MAX_SUM = 78, 112
ODD_RATIOS = {(2,3), (3,2)}
ZONE_RATIOS = {(1,2,2), (2,1,2), (2,2,1)}
MAX_CONSECUTIVE = 2
MIN_COLD_OMISSION = 10
MODEL_NAMES = ["频率", "遗漏", "贝叶斯", "马尔可夫", "关联矩阵", "趋势", "周期", "结构"]
FREEZE_WEIGHT = 0.02
BASE_WEIGHT = 0.05
MAX_WEIGHT = 0.3

# ==================== 记忆管理 ====================
class MemoryManager:
    def __init__(self, data_path="data.csv"):
        self.data_path = data_path
        self.memory_path = "ai_memory.json"
        self.df = self._load_full_data()
        self.memory = self._load_or_init_memory()

    def _load_full_data(self):
        # 关键：header=None（无表头）+ sep='\s+'（空格分隔）+ names手动指定列名
        cols = ['issue','date','f1','f2','f3','f4','f5','b1','b2']
        df = pd.read_csv(
            self.data_path,
            sep='\s+',       # 任意数量空格都当分隔符
            header=None,     # 明确无表头，第一行直接当数据读
            names=cols,      # 手动指定9列的列名
            usecols=range(9) # 只取前9列，避免多余空格干扰
        )
        df['front'] = df[['f1','f2','f3','f4','f5']].apply(lambda x: sorted(x.tolist()), axis=1)
        df['back'] = df[['b1','b2']].apply(lambda x: sorted(x.tolist()), axis=1)
        return df

    def _load_or_init_memory(self):
        if os.path.exists(self.memory_path):
            with open(self.memory_path, "r") as f:
                return json.load(f)
        return self._pretrain()

    def _pretrain(self):
        print("首次运行：执行全量预训练...")
        df = self.df
        hist_front = df['front'].tolist()
        flat_front = [n for draw in hist_front for n in draw]
        freq_front = Counter(flat_front)
        
        weights = {name: 1.0/len(MODEL_NAMES) for name in MODEL_NAMES}
        memory = {
            "weights": weights,
            "rolling_front": hist_front[-ROLLING_WINDOW:],
            "rolling_back": df['back'].tolist()[-ROLLING_WINDOW:],
            "total_issues": len(df),
            "freq_front": {str(k):v for k,v in freq_front.items()},
            "history_hits": [],
            "model_hit_history": {name: [] for name in MODEL_NAMES},
            "model_top20": {name: [] for name in MODEL_NAMES}
        }
        with open(self.memory_path, "w") as f:
            json.dump(memory, f)
        print(f"预训练完成！共加载{len(df)}期历史数据")
        return memory

    def update_rolling_window(self, new_front, new_back):
        self.memory["rolling_front"].append(new_front)
        self.memory["rolling_back"].append(new_back)
        if len(self.memory["rolling_front"]) > ROLLING_WINDOW:
            self.memory["rolling_front"].pop(0)
            self.memory["rolling_back"].pop(0)

    def update_weights_and_hits(self, hit_counts):
        for name in MODEL_NAMES:
            self.memory["model_hit_history"][name].append(hit_counts[name])
            if len(self.memory["model_hit_history"][name]) > 5:
                self.memory["model_hit_history"][name].pop(0)
        
        for name in MODEL_NAMES:
            hit_hist = self.memory["model_hit_history"][name]
            current_weight = self.memory["weights"][name]
            if len(hit_hist) >= 5 and sum(hit_hist) <= 0:
                self.memory["weights"][name] = FREEZE_WEIGHT
            elif len(hit_hist) >= 2 and sum(hit_hist[-2:]) >= 1 and current_weight == FREEZE_WEIGHT:
                self.memory["weights"][name] = BASE_WEIGHT
            elif len(hit_hist) >= 3 and current_weight < 0.07:
                self.memory["weights"][name] *= 0.9

        total_hits = sum(hit_counts.values())
        lr = 0.05 if total_hits >= 3 else 0.2
        current_weights = np.array([self.memory["weights"][name] for name in MODEL_NAMES])
        hit_rates = np.array([hit_counts[name]/5 for name in MODEL_NAMES])
        target = hit_rates / (hit_rates.sum() + 1e-9)
        new_weights = current_weights + lr * (target - current_weights)
        new_weights = np.clip(new_weights, FREEZE_WEIGHT, MAX_WEIGHT)
        new_weights /= new_weights.sum()
        for i, name in enumerate(MODEL_NAMES):
            self.memory["weights"][name] = float(new_weights[i])

    def save_memory(self):
        if len(self.memory["history_hits"]) > 1000:
            self.memory["history_hits"] = self.memory["history_hits"][-1000:]
        with open(self.memory_path, "w") as f:
            json.dump(self.memory, f, indent=2)

# ==================== 8大模型集成 ====================
class ModelEnsemble:
    def __init__(self, memory_manager):
        self.mem_mgr = memory_manager
        self.rolling_front = memory_manager.memory["rolling_front"]
        self.omission = self._get_omission()

    def _get_omission(self):
        last_seen = np.full(N_FRONT, -1)
        for idx, draw in enumerate(reversed(self.rolling_front)):
            for n in draw:
                if last_seen[n-1] == -1:
                    last_seen[n-1] = idx
        return np.where(last_seen == -1, len(self.rolling_front), last_seen)

    def _model_freq(self):
        long_freq = np.array([self.mem_mgr.memory["freq_front"].get(str(i+1), 0) for i in range(N_FRONT)])
        short_counts = np.array([n for draw in self.rolling_front for n in draw].count(i+1) for i in range(N_FRONT))
        return 0.3 * (long_freq / long_freq.sum()) + 0.7 * (short_counts / (short_counts.sum() + 1e-9))

    def _model_omission(self):
        lam = N_FRONT / 5
        return (lam ** self.omission) * np.exp(-lam) + 1e-9

    def _model_bayes(self):
        alpha = 1
        total = len(self.rolling_front)
        flat = [n for draw in self.rolling_front for n in draw]
        counts = Counter(flat)
        hits = np.array([counts.get(i+1, 0) for i in range(N_FRONT)])
        return (alpha + hits) / (alpha + total)

    def _model_markov(self):
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
        score = np.zeros(N_FRONT)
        cold_nums = set(np.where(self.omission >= MIN_COLD_OMISSION)[0] + 1)
        for num in range(1, N_FRONT+1):
            temp = []
            for _ in range(20):
                others = np.random.choice([i for i in range(1, N_FRONT+1) if i != num], 4, replace=False)
                sample = sorted(list(others) + [num])
                if self._validate_structure(sample):
                    temp.append(1.2 if num in cold_nums else 1.0)
            score[num-1] = np.mean(temp) if temp else 0
        return score / (score.max() + 1e-9)

    def _validate_structure(self, nums):
        if len(nums) != 5: return False
        nums = sorted(nums)
        s = sum(nums)
        if not MIN_SUM <= s <= MAX_SUM: return False
        odd = sum(1 for n in nums if n % 2 != 0)
        if (odd, 5-odd) not in ODD_RATIOS: return False
        z1 = sum(1 for n in nums if 1 <= n <= 12)
        z2 = sum(1 for n in nums if 13 <= n <= 24)
        z3 = sum(1 for n in nums if 25 <= n <= 35)
        if (z1, z2, z3) not in ZONE_RATIOS: return False
        consecutive = sum(1 for i in range(4) if nums[i+1] - nums[i] == 1)
        if consecutive > MAX_CONSECUTIVE: return False
        return True

    def predict_front(self):
        models = {
            "频率": self._model_freq(), "遗漏": self._model_omission(),
            "贝叶斯": self._model_bayes(), "马尔可夫": self._model_markov(),
            "关联矩阵": self._model_matrix(), "趋势": self._model_trend(),
            "周期": self._model_cycle(), "结构": self._model_struct()
        }
        weights = np.array([self.mem_mgr.memory["weights"][name] for name in MODEL_NAMES])
        final = np.zeros(N_FRONT)
        for i, (name, vec) in enumerate(models.items()):
            vec_norm = (vec - vec.min()) / (vec.max() - vec.min() + 1e-9)
            final += vec_norm * weights[i]
            self.mem_mgr.memory["model_top20"][name] = (np.argsort(vec_norm)[-20:] + 1).tolist()
        return final / final.sum()

# ==================== 蒙特卡罗采样 ====================
class MonteCarloSampler:
    def __init__(self, model_ensemble, memory_manager):
        self.model = model_ensemble
        self.mem_mgr = memory_manager
        self.omission = model_ensemble.omission
        self.cold_nums = set(np.where(self.omission >= MIN_COLD_OMISSION)[0] + 1)

    def _calc_crowd_score(self, combo):
        recent_flat = [n for draw in self.mem_mgr.memory["rolling_front"][-20:] for n in draw]
        recent_hot = {num for num in range(1, N_FRONT+1) if recent_flat.count(num) >= 3}
        hot_ratio = len(set(combo) & recent_hot) / 5
        return hot_ratio

    def sample_front(self):
        scores = self.model.predict_front()
        top50_idx = np.argsort(scores)[-50:]
        top50_probs = scores[top50_idx] / scores[top50_idx].sum()
        results = Counter()
        for _ in range(MC_SAMPLES):
            sample_idx = np.random.choice(top50_idx, 5, replace=False, p=top50_probs)
            sample = sorted(sample_idx + 1)
            if not self.model._validate_structure(sample):
                continue
            if self._calc_crowd_score(sample) >= 0.8:
                continue
            if len(set(sample) & self.cold_nums) < 1:
                continue
            results[tuple(sample)] += 1
        return results.most_common(3)

# ==================== 对外接口 ====================
def load_data():
    return MemoryManager()

def get_ai_prediction(mem_mgr):
    ensemble = ModelEnsemble(mem_mgr)
    sampler = MonteCarloSampler(ensemble, mem_mgr)
    front_top3 = sampler.sample_front()
    predictions = []
    for (front, _) in front_top3:
        crowd = sampler._calc_crowd_score(front)
        cold_cnt = len(set(front) & sampler.cold_nums)
        predictions.append({
            "front": list(front), "back": sorted(np.random.choice(12, 2, replace=False) + 1),
            "crowd_score": round(crowd, 4), "cold_cnt": cold_cnt
        })
    return predictions

def feedback_learning(mem_mgr, issue, real_front, real_back):
    hit_counts = {}
    current_top20 = mem_mgr.memory["model_top20"]
    real_set = set(real_front)
    for name in MODEL_NAMES:
        top20 = set(current_top20.get(name, []))
        hit_counts[name] = len(top20 & real_set)
    
    mem_mgr.update_rolling_window(real_front, real_back)
    mem_mgr.update_weights_and_hits(hit_counts)
    mem_mgr.memory["history_hits"].append({
        "issue": issue, "real_front": real_front, "real_back": real_back, "hit_counts": hit_counts
    })
    mem_mgr.save_memory()
    return hit_counts, mem_mgr.memory["weights"]
