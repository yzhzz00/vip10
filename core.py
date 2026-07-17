import pandas as pd
import numpy as np
import math
from collections import Counter, deque
import warnings
warnings.filterwarnings('ignore')

# ================================================================
# 第一部分：大乐透数学理论库 (The Theory)
# ================================================================
class DLTTheory:
    """封装大乐透的数学理论边界"""
    def __init__(self):
        # 前区组合数 C(35,5) = 324632
        self.total_combinations = 324632
        # 理论平均和值 (1+35)*5/2 = 90
        self.avg_sum = 90
        # 理论奇偶比 1:1 (实际历史偏向 3:2 或 2:3)
        self.common_odd_even = [(3,2), (2,3)]
        # 三区分布 (01-12, 13-24, 25-35)
        self.zones = [(1,12), (13,24), (25,35)]

    def structure_score(self, numbers):
        """评估一组号码的结构合理性 (0-1分)"""
        if len(numbers) != 5: return 0
        score = 0
        # 1. 和值校验
        s = sum(numbers)
        sum_score = 1 - abs(s - self.avg_sum) / self.avg_sum
        score += max(0, sum_score) * 0.3

        # 2. 奇偶校验
        odd = sum(1 for n in numbers if n % 2 != 0)
        even = 5 - odd
        if (odd, even) in self.common_odd_even:
            score += 0.3
        
        # 3. 三区校验
        zone_count = [0, 0, 0]
        for n in numbers:
            if self.zones[0][0] <= n <= self.zones[0][1]: zone_count[0] += 1
            elif self.zones[1][0] <= n <= self.zones[1][1]: zone_count[1] += 1
            else: zone_count[2] += 1
        # 历史常见结构: 2:2:1, 2:1:2, 1:2:2
        if sorted(zone_count) in [[0, 2, 3], [1, 1, 3], [1, 2, 2]]:
            score += 0.4
        return min(1.0, score)

# ================================================================
# 第二部分：AI模型委员会 (The AI Committee)
# ================================================================
class AICouncil:
    """八大模型组成的委员会，负责投票"""
    def __init__(self):
        self.models = {
            'Frequency': self._model_frequency,
            'Omission': self._model_omission,
            'Bayesian': self._model_bayesian,
            'Markov': self._model_markov,
            'Matrix': self._model_matrix,
            'Trend': self._model_trend,
            'Cycle': self._model_cycle,
            'Structure': self._model_structure
        }
        # 动态权重 (初始值，会被自主学习更新)
        self.weights = {name: 1.0/len(self.models) for name in self.models}
        self.history_hits = {name: deque(maxlen=200) for name in self.models}

    # --- 以下是8个模型的占位实现 (此处为简化逻辑，保证能跑) ---
    def _model_frequency(self, df): return df['f1'].value_counts().reindex(range(1,36), fill_value=0)
    def _model_omission(self, df): 
        last = df[['f1','f2','f3','f4','f5']].apply(lambda x: x.tolist()).explode().reset_index()
        last['gap'] = last.groupby(0).cumcount()
        return last.groupby(0)['gap'].first().reindex(range(1,36), fill_value=50)
    def _model_bayesian(self, df): return np.random.dirichlet(np.ones(35)) * 100 # 模拟概率分布
    def _model_markov(self, df): return np.random.rand(35) # 模拟状态转移
    def _model_matrix(self, df): return np.random.rand(35) # 模拟关联度
    def _model_trend(self, df): return df['f1'].rolling(10).mean().fillna(0).iloc[-1] if len(df)>10 else 0
    def _model_cycle(self, df): return np.sin(np.linspace(0, 3.14, 35)) # 模拟周期性
    def _model_structure(self, df): return [DLTTheory().structure_score(sorted(np.random.choice(35,5,replace=False)+1)) for _ in range(35)]

    def vote(self, df):
        """委员会投票，输出每个号码的最终得分"""
        votes = pd.DataFrame({name: model(df) for name, model in self.models.items()})
        # 加权平均
        final_score = votes.apply(lambda row: sum(row[name] * self.weights[name] for name in self.models), axis=1)
        return final_score

    def update_weights(self, hit_numbers):
        """根据命中结果更新权重 (自主学习)"""
        for name in self.models:
            # 简化逻辑：如果模型本次推荐的号码出现在开奖号里，增加权重
            # 真实逻辑需要对比模型输出的TopN与开奖号
            self.history_hits[name].append(1 if np.random.rand() > 0.7 else 0) # 模拟命中反馈
            hit_rate = np.mean(self.history_hits[name])
            self.weights[name] = hit_rate
        # 归一化
        total = sum(self.weights.values())
        self.weights = {k: v/total for k, v in self.weights.items()}

# ================================================================
# 第三部分：分段式蒙特卡洛模拟 (Chunked Monte Carlo)
# ================================================================
class ChunkedMonteCarlo:
    """为了解决手机/低算力卡顿，将模拟拆分为小块"""
    def __init__(self, theory, council):
        self.theory = theory
        self.council = council

    def simulate(self, top_numbers, chunks=10, sims_per_chunk=10000):
        """
        分段模拟：
        - top_numbers: AI委员会选出的前35个高概率号码
        - chunks: 分成几段跑
        - sims_per_chunk: 每段跑多少次
        """
        all_results = Counter()
        base_probs = np.array(top_numbers) / sum(top_numbers)
        
        for i in range(chunks):
            chunk_results = Counter()
            for _ in range(sims_per_chunk):
                # 约束性采样：只在AI选的高概率号码里随机抽取组合
                sample = np.random.choice(range(1,36), size=5, replace=False, p=base_probs)
                # 结构过滤：不符合理论的扔掉
                if self.theory.structure_score(sorted(sample)) > 0.7:
                    chunk_results[tuple(sorted(sample))] += 1
            all_results.update(chunk_results)
            # 此处可插入 yield 用于显示进度条，防止UI卡死
            # print(f"Chunk {i+1}/{chunks} done.")
            
        # 返回出现频率最高的Top 3
        return all_results.most_common(3)

# ================================================================
# 第四部分：每日预测与回测引擎 (Daily Engine)
# ================================================================
class DailyEngine:
    def __init__(self):
        self.theory = DLTTheory()
        self.council = AICouncil()
        self.monte_carlo = ChunkedMonteCarlo(self.theory, self.council)
        self.history_log = deque(maxlen=365) # 存储每日预测与实际对比

    def predict_today(self, df):
        """生成今日预测"""
        # 1. AI委员会投票
        scores = self.council.vote(df)
        
        # 2. 提取Top 20高概率号码 (缩小蒙特卡洛范围)
        top_20_idx = scores.nlargest(20).index.tolist()
        top_20_scores = scores[top_20_idx].values
        
        # 3. 分段蒙特卡洛模拟
        top_3_combos = self.monte_carlo.simulate(top_20_scores)
        
        return top_3_combos

    def verify_and_learn(self, df, actual_numbers):
        """开奖后验证并更新模型"""
        # 1. 更新AI委员会权重
        self.council.update_weights(actual_numbers)
        
        # 2. 记录对比结果
        today_pred = self.predict_today(df)
        hit_info = {
            'date': df.iloc[-1]['date'],
            'pred': today_pred,
            'actual': actual_numbers,
            'hits': [len(set(pred).intersection(set(actual_numbers))) for pred, _ in today_pred]
        }
        self.history_log.append(hit_info)
        return hit_info

# ================================================================
# 对外接口 (供 app.py 调用)
# ================================================================
_engine = None

def get_engine():
    global _engine
    if _engine is None:
        _engine = DailyEngine()
    return _engine

def run_daily_prediction(df):
    engine = get_engine()
    return engine.predict_today(df)

def run_verification(df, actual_numbers):
    engine = get_engine()
    return engine.verify_and_learn(df, actual_numbers)

def get_history():
    engine = get_engine()
    return list(engine.history_log)

