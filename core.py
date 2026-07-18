import numpy as np
import pandas as pd
import json
import os
from collections import Counter
from scipy.stats import poisson
import warnings
warnings.filterwarnings("ignore")

# ==================== 全局常量 ====================
N_FRONT = 35
N_BACK = 12
ROLLING_WINDOW = 200
MC_SAMPLES = 5000
STRUCT_MIN_SCORE = 0.6
MODEL_NAMES = ["频率", "遗漏", "贝叶斯", "马尔可夫", "关联矩阵", "趋势", "周期", "结构"]

# ==================== 大乐透理论约束 ====================
class DLTTheory:
    @staticmethod
    def structure_score(nums_front):
        if len(nums_front) != 5: return 0
        nums = sorted(nums_front)
        s = sum(nums)
        if not 70 <= s <= 130: return 0
        odd = sum(1 for n in nums if n % 2 != 0)
        if odd not in (2, 3): return 0
        z1 = sum(1 for n in nums if 1 <= n <= 12)
        z2 = sum(1 for n in nums if 13 <= n <= 24)
        z3 = sum(1 for n in nums if 25 <= n <= 35)
        if sorted([z1, z2, z3]) not in [[1,2,2], [0,2,3], [1,1,3]]: return 0
        consecutive = sum(1 for i in range(4) if nums[i+1] - nums[i] == 1)
        if consecutive > 2: return 0
        sum_score = np.exp(-0.5 * ((s - 90) / 18) ** 2)
        return min(1.0, sum_score + 0.3 + 0.4)

# ==================== 记忆管理 ====================
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
                return json.load(f)
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
        
        weights = {name: 1.0/len(MODEL_NAMES) for name in MODEL_NAMES}
        
        memory = {
            "weights": weights,
            "rolling_front": hist_front[-ROLLING_WINDOW:],
            "rolling_back": hist_back[-ROLLING_WINDOW:],
            "total_issues": len(df),
            "pretrained": True,
            "freq_front": {str(k):v for k,v in self.freq_front.items()},
            "freq_back": {str(k):v for k,v in self.freq_back.items()},
            "history_hits": []
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

    def update_weights(self, hit_counts):
        lr = 0.1
        current_weights = np.array([self.memory["weights"][name] for name in MODEL_NAMES])
        hit_rates = np.array([hit_counts[name]/5 for name in MODEL_NAMES])
        target = hit_rates / (hit_rates.sum() + 1e-9)
        new_weights = current_weights + lr * (target - current_weights)
        new_weights = np.clip(new_weights, 0.05, 0.3)
        new_weights /= new_weights.sum()
        for i, name in enumerate(MODEL_NAMES):
            self.memory["weights"][name] = float(new_weights[i])

    def save_memory(self):
        # 熔断机制：只保留最近1000条历史，防止JSON文件过大撑爆Render免费版内存
        if len(self.memory["history_hits"]) > 1000:
            self.memory["history_hits"] = self.memory["history_hits"][-1000:]
        with open(self.memory_path, "w") as f:
            json.dump(self.memory, f, indent=2)

# ==================== 8大模型集成 ====================
class ModelEnsemble:
    def __init__(self, memory_manager):
        self.mem_mgr = memory_manager
        self.theory = DLTTheory()

    def _get_recent_counts(self):
        recent_front = self.mem_mgr.memory["rolling_front"]
        flat = [n for draw in recent_front for n in draw]
        return [flat.count(i+1) for i in range(N_FRONT)]

    def _model_freq(self):
        long_freq = np.array([self.mem_mgr.freq_front.get(str(i+1), 0) for i in range(N_FRONT)])
        short_counts = np.array(self._get_recent_counts())
        if short_counts.sum() == 0: return np.ones(N_FRONT)/N_FRONT
        return 0.3 * (long_freq / long_freq.sum()) + 0.7 * (short_counts / short_counts.sum())

    def _model_omission(self):
        rolling = self.mem_mgr.memory["rolling_front"]
        last_seen = np.full(N_FRONT, -1)
        for idx, draw in enumerate(reversed(rolling)):
            for n in draw:
                if last_seen[n-1] == -1: last_seen[n-1] = idx
        omission = np.where(last_seen == -1, len(rolling), last_seen)
        lam = N_FRONT / 5
        return (lam ** omission) * np.exp(-lam) + 1e-9

    def _model_bayes(self):
        rolling = self.mem_mgr.memory["rolling_front"]
        alpha = 1
        total = len(rolling)
        flat = [n for draw in rolling for n in draw]
        counts = Counter(flat)
        hits = np.array([counts.get(i+1, 0) for i in range(N_FRONT)])
        return (alpha + hits) / (alpha + total)

    def _model_markov(self):
        recent = self.mem_mgr.memory["rolling_front"][-50:]
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
        recent = self.mem_mgr.memory["rolling_front"][-50:]
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
        recent = self.mem_mgr.memory["rolling_front"][-50:]
        series = np.zeros((len(recent), N_FRONT))
        for idx, draw in enumerate(recent):
            for n in draw: series[idx, n-1] = 1
        ema = np.zeros(N_FRONT)
        alpha = 0.15
        for t in range(len(series)): ema = alpha * series[t] + (1-alpha) * ema
        return ema

    def _model_cycle(self):
        rolling = self.mem_mgr.memory["rolling_front"]
        score = np.zeros(N_FRONT)
        for num in range(1, N_FRONT+1):
            idx = [i for i, draw in enumerate(rolling) if num in draw]
            if len(idx) > 2:
                period = np.mean(np.diff(idx))
                if period > 0:
                    phase = idx[-1] % period
                    diff = abs((len(rolling)-1) % period - phase)
                    score[num-1] = 1 / (diff + 1e-9)
        return score

    def _model_struct(self):
        score = np.zeros(N_FRONT)
        for num in range(1, N_FRONT+1):
            temp = []
            for _ in range(20):
                others = np.random.choice([i for i in range(1, N_FRONT+1) if i != num], 4, replace=False)
                temp.append(self.theory.structure_score(sorted(list(others) + [num])))
            score[num-1] = np.mean(temp)
        return score / (score.max() + 1e-9)

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
        return final

    def predict_back(self):
        rolling = self.mem_mgr.memory["rolling_back"]
        flat = [n for draw in rolling for n in draw]
        freq = np.array([flat.count(i+1) for i in range(N_BACK)])
        last_seen = np.full(N_BACK, -1)
        for idx, draw in enumerate(reversed(rolling)):
            for n in draw:
                if last_seen[n-1] == -1: last_seen[n-1] = idx
        omission = np.where(last_seen == -1, len(rolling), last_seen)
        lam = N_BACK / 2
        omit_score = (lam ** omission) * np.exp(-lam) + 1e-9
        if freq.sum() == 0: return np.ones(N_BACK)/N_BACK
        return 0.6 * (freq / freq.sum()) + 0.4 * (omit_score / omit_score.sum())

# ==================== 智能蒙特卡罗 ====================
class MonteCarloSampler:
    def __init__(self, model_ensemble, memory_manager):
        self.model = model_ensemble
        self.mem_mgr = memory_manager
        self.theory = DLTTheory()

    def sample_front(self):
        scores = self.model.predict_front()
        top20_idx = np.argsort(scores)[-20:]
        top20_probs = scores[top20_idx] / scores[top20_idx].sum()
        results = Counter()
        for _ in range(MC_SAMPLES):
            sample_idx = np.random.choice(top20_idx, 5, replace=False, p=top20_probs)
            sample = sorted(sample_idx + 1)
            if self.theory.structure_score(sample) >= STRUCT_MIN_SCORE:
                results[tuple(sample)] += 1
        return results.most_common(3)

    def sample_back(self):
        scores = self.model.predict_back()
        if scores.sum() == 0: scores = np.ones(N_BACK)
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
    ensemble = ModelEnsemble(mem_mgr)
    sampler = MonteCarloSampler(ensemble, mem_mgr)
    front_top3 = sampler.sample_front()
    back_best = sampler.sample_back()
    predictions = []
    for (front, freq) in front_top3:
        predictions.append({
            "front": list(front), "back": list(back_best),
            "confidence": freq/MC_SAMPLES
        })
    return predictions

def feedback_learning(mem_mgr, issue, real_front, real_back):
    # 模拟命中数（实际应用中应替换为真实计算）
    hit_counts = {name: np.random.randint(0, 3) for name in MODEL_NAMES}
    
    mem_mgr.update_rolling_window(real_front, real_back)
    mem_mgr.update_weights(hit_counts)
    mem_mgr.memory["history_hits"].append({
        "issue": issue, "real_front": real_front, "real_back": real_back,
        "hit_counts": hit_counts, "weights_after": mem_mgr.memory["weights"].copy()
    })
    mem_mgr.save_memory() # 内部包含熔断逻辑
    return hit_counts, mem_mgr.memory["weights"]
