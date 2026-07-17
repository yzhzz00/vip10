import pandas as pd
import numpy as np
from collections import Counter, deque
import math

# ================================================================
# 第一部分：大乐透数学理论库
# ================================================================
class DLTTheory:
    def __init__(self):
        self.N = 35
        self.avg_sum = 90
        self.zones = [(1, 12), (13, 24), (25, 35)]

    def structure_score(self, numbers):
        if len(numbers) != 5: return 0
        score = 0
        numbers = sorted(numbers)
        s = sum(numbers)
        sum_std = 18
        score += np.exp(-0.5 * ((s - self.avg_sum) / sum_std) ** 2) * 0.3
        odd = sum(1 for n in numbers if n % 2 != 0)
        if (odd, 5 - odd) in [(3, 2), (2, 3)]: score += 0.3
        zone_count = [0, 0, 0]
        for n in numbers:
            if self.zones[0][0] <= n <= self.zones[0][1]: zone_count[0] += 1
            elif self.zones[1][0] <= n <= self.zones[1][1]: zone_count[1] += 1
            else: zone_count[2] += 1
        if sorted(zone_count) in [[0, 2, 3], [1, 1, 3], [1, 2, 2]]: score += 0.4
        return min(1.0, score)

# ================================================================
# 第二部分：AI模型委员会 (全真数学实现)
# ================================================================
class AICouncil:
    def __init__(self, df_history):
        self.df = df_history
        self.history_lists = self.df[['f1','f2','f3','f4','f5']].values.tolist()
        self.N = 35
        self.weights = {name: 1.0/8 for name in ['Frequency', 'Omission', 'Bayesian', 'Markov', 'Matrix', 'Trend', 'Cycle', 'Structure']}
        self._precalculate()

    def _precalculate(self):
        flat = [num for draw in self.history_lists for num in draw]
        self.freq_counts = Counter(flat)

    def _model_frequency(self):
        total = len(self.history_lists)
        return np.array([self.freq_counts.get(i, 0) / total for i in range(1, self.N + 1)]) + 1e-9

    def _model_omission(self):
        last_indices = np.full(self.N, -1)
        for idx, draw in enumerate(reversed(self.history_lists)):
            for num in draw:
                if last_indices[num-1] == -1:
                    last_indices[num-1] = idx
        current_omission = np.where(last_indices == -1, len(self.history_lists), last_indices)
        lambda_ = self.N / 5
        return (lambda_ ** current_omission) * np.exp(-lambda_) + 1e-9

    def _model_bayesian(self):
        alpha_prior, beta_prior = 1, 1
        total = len(self.history_lists)
        hits = np.array([self.freq_counts.get(i, 0) for i in range(1, self.N + 1)])
        return (alpha_prior + hits) / (alpha_prior + beta_prior + total)

    def _model_markov(self):
        T = np.zeros((self.N, self.N))
        for draw in self.history_lists:
            for i in range(5):
                for j in range(i + 1, 5):
                    n1, n2 = draw[i]-1, draw[j]-1
                    T[n1, n2] += 1
                    T[n2, n1] += 1
        row_sums = T.sum(axis=1, keepdims=True)
        T_norm = np.divide(T, row_sums, out=np.zeros_like(T), where=row_sums!=0)
        last_draw = self.history_lists[-1]
        return T_norm[last_draw[0]-1] + 1e-9

    def _model_matrix(self):
        CoMatrix = np.zeros((self.N, self.N))
        for draw in self.history_lists:
            for i in range(5):
                for j in range(i + 1, 5):
                    n1, n2 = draw[i]-1, draw[j]-1
                    CoMatrix[n1, n2] += 1
                    CoMatrix[n2, n1] += 1
        last_draw = self.history_lists[-1]
        assoc_scores = np.zeros(self.N)
        for i in range(self.N):
            for j in last_draw:
                assoc_scores[i] += CoMatrix[i, j-1]
        return assoc_scores / (assoc_scores.max() + 1e-9)

    def _model_trend(self):
        series = np.zeros((len(self.history_lists), self.N))
        for idx, draw in enumerate(self.history_lists):
            for num in draw:
                series[idx, num-1] = 1
        alpha = 0.1
        ema = np.zeros(self.N)
        for t in range(len(series)):
            ema = alpha * series[t] + (1 - alpha) * ema
        return ema

    def _model_cycle(self):
        periods = []
        for num in range(1, self.N + 1):
            indices = [idx for idx, draw in enumerate(self.history_lists) if num in draw]
            if len(indices) > 1:
                gaps = np.diff(indices)
                period = np.mean(gaps) if len(gaps) > 0 else 7
                phase = indices[-1] % period
                current_phase_diff = abs((len(self.history_lists) - 1) % period - phase)
                periods.append(1 / (current_phase_diff + 1e-9))
            else:
                periods.append(0)
        return np.array(periods)

    def _model_structure(self, theory):
        scores = np.zeros(self.N)
        for num in range(1, self.N + 1):
            temp_scores = []
            for _ in range(50): # Reduced samples for speed
                others = np.random.choice([x for x in range(1, self.N + 1) if x != num], 4, replace=False)
                combo = list(others) + [num]
                temp_scores.append(theory.structure_score(sorted(combo)))
            scores[num-1] = np.mean(temp_scores)
        return scores / (scores.max() + 1e-9)

    def vote(self, theory):
        raw_scores = {
            'Frequency': self._model_frequency(),
            'Omission': self._model_omission(),
            'Bayesian': self._model_bayesian(),
            'Markov': self._model_markov(),
            'Matrix': self._model_matrix(),
            'Trend': self._model_trend(),
            'Cycle': self._model_cycle(),
            'Structure': self._model_structure(theory)
        }
        final_score = np.zeros(self.N)
        for name, score_vec in raw_scores.items():
            min_s, max_s = score_vec.min(), score_vec.max()
            norm_score = (score_vec - min_s) / (max_s - min_s + 1e-9)
            final_score += norm_score * self.weights[name]
        return final_score

# ================================================================
# 第三部分：蒙特卡洛模拟
# ================================================================
class ChunkedMonteCarlo:
    def __init__(self, theory, council):
        self.theory = theory
        self.council = council

    def simulate(self, top_numbers_idx, chunks=5, sims_per_chunk=2000):
        all_results = Counter()
        full_scores = self.council.vote(self.theory)
        top_scores = full_scores[top_numbers_idx]
        probs = top_scores / top_scores.sum()

        for _ in range(chunks):
            chunk_results = Counter()
            for _ in range(sims_per_chunk):
                sample_idx = np.random.choice(top_numbers_idx, size=5, replace=False, p=probs)
                sample = sorted(sample_idx + 1)
                if self.theory.structure_score(sample) > 0.6:
                    chunk_results[tuple(sample)] += 1
            all_results.update(chunk_results)
        return all_results.most_common(3)

# ================================================================
# 第四部分：每日引擎
# ================================================================
class DailyEngine:
    def __init__(self, df):
        self.df = df
        self.theory = DLTTheory()
        self.council = AICouncil(self.df)
        self.monte_carlo = ChunkedMonteCarlo(self.theory, self.council)

    def predict_today(self):
        scores = self.council.vote(self.theory)
        top_20_idx = np.argsort(scores)[-20:]
        return self.monte_carlo.simulate(top_20_idx), scores

# ================================================================
# 对外接口
# ================================================================
def load_data():
    cols = ['issue','date','f1','f2','f3','f4','f5','b1','b2']
    df = pd.read_csv('data.csv', header=0, names=cols, usecols=range(9))
    return df

_engine = None
def get_engine():
    global _engine
    if _engine is None:
        df = load_data()
        _engine = DailyEngine(df)
    return _engine

def run_daily_prediction():
    return get_engine().predict_today()

def get_history():
    return []
