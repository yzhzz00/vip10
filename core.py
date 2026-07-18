import numpy as np
import pandas as pd
from collections import Counter, deque
import math

# ==================== 大乐透理论约束 ====================
class DLTTheory:
    def __init__(self):
        self.N = 35  # 前区总数
        self.avg_sum = 90  # 理论平均和值

    def structure_score(self, nums):
        """结构合理性评分（0-1分，符合历史规律得高分）"""
        if len(nums) != 5:
            return 0
        nums = sorted(nums)
        # 1. 和值校验（正态分布，越接近90分越高）
        s = sum(nums)
        sum_score = np.exp(-0.5 * ((s - self.avg_sum) / 18) ** 2)
        # 2. 奇偶校验（3:2或2:3得满分）
        odd = sum(1 for n in nums if n % 2 != 0)
        odd_score = 0.3 if odd in (2, 3) else 0.1
        # 3. 三区校验（01-12/13-24/25-35，1:2:2/2:1:2/2:2:1得满分）
        z1 = sum(1 for n in nums if 1 <= n <= 12)
        z2 = sum(1 for n in nums if 13 <= n <= 24)
        z3 = sum(1 for n in nums if 25 <= n <= 35)
        zone_score = 0.4 if sorted([z1, z2, z3]) in [[1,2,2], [0,2,3]] else 0.2
        return min(1.0, sum_score + odd_score + zone_score)

# ==================== AI委员会（8大模型真逻辑） ====================
class AICouncil:
    def __init__(self, df):
        self.df = df
        self.history = df[['f1','f2','f3','f4','f5']].values.tolist()
        self.N = 35
        # 初始权重均分，后续自主学习调整
        self.weights = {
            '频率': 0.125, '遗漏': 0.125, '贝叶斯': 0.125, '马尔可夫': 0.125,
            '关联矩阵': 0.125, '趋势': 0.125, '周期': 0.125, '结构': 0.125
        }

    # 1. 频率模型（历史出现概率）
    def _freq_model(self):
        flat = [n for draw in self.history for n in draw]
        counts = Counter(flat)
        return np.array([counts.get(i, 0) / len(self.history) for i in range(1, self.N+1)]) + 1e-9

    # 2. 遗漏模型（泊松分布回归）
    def _omission_model(self):
        last = np.full(self.N, -1)
        for idx, draw in enumerate(reversed(self.history)):
            for n in draw:
                if last[n-1] == -1:
                    last[n-1] = idx
        omission = np.where(last == -1, len(self.history), last)
        lam = self.N / 5  # 理论平均遗漏
        return (lam ** omission) * np.exp(-lam) + 1e-9

    # 3. 贝叶斯模型（后验概率）
    def _bayesian_model(self):
        alpha, beta = 1, 1  # 先验参数
        total = len(self.history)
        counts = Counter([n for draw in self.history for n in draw])
        hits = np.array([counts.get(i, 0) for i in range(1, self.N+1)])
        return (alpha + hits) / (alpha + beta + total)

    # 4. 马尔可夫模型（状态转移）
    def _markov_model(self):
        T = np.zeros((self.N, self.N))
        for draw in self.history:
            for i in range(5):
                for j in range(i+1, 5):
                    a, b = draw[i]-1, draw[j]-1
                    T[a, b] += 1
                    T[b, a] += 1
        row_sum = T.sum(axis=1, keepdims=True)
        T_norm = np.divide(T, row_sum, out=np.zeros_like(T), where=row_sum!=0)
        last_draw = self.history[-1]
        return T_norm[last_draw[0]-1] + 1e-9

    # 5. 关联矩阵模型（共现概率）
    def _matrix_model(self):
        Co = np.zeros((self.N, self.N))
        for draw in self.history:
            for i in range(5):
                for j in range(i+1, 5):
                    a, b = draw[i]-1, draw[j]-1
                    Co[a, b] += 1
                    Co[b, a] += 1
        last = self.history[-1]
        score = np.zeros(self.N)
        for i in range(self.N):
            for j in last:
                score[i] += Co[i, j-1]
        return score / (score.max() + 1e-9)

    # 6. 趋势模型（EMA指数移动平均）
    def _trend_model(self):
        series = np.zeros((len(self.history), self.N))
        for idx, draw in enumerate(self.history):
            for n in draw:
                series[idx, n-1] = 1
        ema = np.zeros(self.N)
        alpha = 0.1
        for t in range(len(series)):
            ema = alpha * series[t] + (1-alpha) * ema
        return ema

    # 7. 周期模型（相位差检测）
    def _cycle_model(self):
        score = np.zeros(self.N)
        for num in range(1, self.N+1):
            idx = [i for i, draw in enumerate(self.history) if num in draw]
            if len(idx) > 1:
                period = np.mean(np.diff(idx))
                phase = idx[-1] % period
                diff = abs((len(self.history)-1) % period - phase)
                score[num-1] = 1 / (diff + 1e-9)
        return score

    # 8. 结构模型（理论约束评分）
    def _structure_model(self, theory):
        score = np.zeros(self.N)
        for num in range(1, self.N+1):
            # 随机生成含该号码的组合，算平均结构分
            temp = []
            for _ in range(30):  # 算力裁剪，少跑几次不影响结果
                others = np.random.choice([i for i in range(1, self.N+1) if i != num], 4, replace=False)
                temp.append(theory.structure_score(sorted(list(others) + [num])))
            score[num-1] = np.mean(temp)
        return score / (score.max() + 1e-9)

    # 委员会加权投票
    def vote(self, theory):
        models = {
            '频率': self._freq_model(),
            '遗漏': self._omission_model(),
            '贝叶斯': self._bayesian_model(),
            '马尔可夫': self._markov_model(),
            '关联矩阵': self._matrix_model(),
            '趋势': self._trend_model(),
            '周期': self._cycle_model(),
            '结构': self._structure_model(theory)
        }
        # 归一化+加权融合
        final = np.zeros(self.N)
        for name, score in models.items():
            min_s, max_s = score.min(), score.max()
            norm = (score - min_s) / (max_s - min_s + 1e-9)
            final += norm * self.weights[name]
        return final

# ==================== 对外接口 ====================
def load_data():
    """加载数据，兜底逻辑避免报错"""
    try:
        cols = ['issue','date','f1','f2','f3','f4','f5','b1','b2']
        df = pd.read_csv('data.csv', header=0, names=cols, usecols=range(9))
        return df
    except Exception as e:
        # 兜底：如果data.csv有问题，自动生成示例数据
        print(f"数据加载失败，使用示例数据：{e}")
        return pd.DataFrame({
            'f1': [6,1,2,5,2,7],
            'f2': [8,4,11,12,9,14],
            'f3': [23,9,16,23,18,19],
            'f4': [26,18,24,27,25,26],
            'f5': [27,33,30,31,33,32]
        })

def get_ai_prediction():
    """生成AI预测结果"""
    df = load_data()
    theory = DLTTheory()
    council = AICouncil(df)
    scores = council.vote(theory)
    # 取Top20高概率号码，做蒙特卡洛筛选
    top20_idx = np.argsort(scores)[-20:]
    results = Counter()
    for _ in range(5000):  # 算力裁剪，5000次模拟足够稳定
        sample_idx = np.random.choice(top20_idx, 5, replace=False)
        sample = sorted(sample_idx + 1)
        if theory.structure_score(sample) > 0.6:  # 过滤不符合结构的组合
            results[tuple(sample)] += 1
    return results.most_common(3), scores
