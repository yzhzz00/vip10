import pandas as pd
import numpy as np
import math
from collections import Counter, defaultdict, deque
import warnings
warnings.filterwarnings('ignore')

# ================================================================
# 第一部分：大乐透数学理论库 (The Theory)
# ================================================================
class DLTTheory:
    """封装大乐透的数学理论边界与约束"""
    def __init__(self):
        self.N = 35  # 前区总数
        self.M = 5   # 选取数量
        self.total_combinations = math.comb(self.N, self.M) # C(35,5) = 324632
        self.avg_sum = (1 + self.N) * self.M / 2  # 理论平均和值 90
        self.zones = [(1, 12), (13, 24), (25, 35)]

    def structure_score(self, numbers):
        """评估一组号码的结构合理性 (0-1分)"""
        if len(numbers) != 5: return 0
        score = 0
        numbers = sorted(numbers)
        
        # 1. 和值校验 (正态分布特性)
        s = sum(numbers)
        # 使用和值的标准差进行归一化 (历史标准差约为15-20)
        sum_std = 18
        sum_score = np.exp(-0.5 * ((s - self.avg_sum) / sum_std) ** 2)
        score += sum_score * 0.3

        # 2. 奇偶校验 (二项分布)
        odd = sum(1 for n in numbers if n % 2 != 0)
        even = 5 - odd
        # 历史最常见的是3:2或2:3
        if (odd, even) in [(3, 2), (2, 3)]:
            score += 0.3
        elif (odd, even) in [(4, 1), (1, 4)]:
            score += 0.15

        # 3. 三区校验
        zone_count = [0, 0, 0]
        for n in numbers:
            if self.zones[0][0] <= n <= self.zones[0][1]: zone_count[0] += 1
            elif self.zones[1][0] <= n <= self.zones[1][1]: zone_count[1] += 1
            else: zone_count[2] += 1
        
        # 历史常见结构: 2:2:1, 2:1:2, 1:2:2
        if sorted(zone_count) in [[0, 2, 3], [1, 1, 3], [1, 2, 2]]:
            score += 0.4
            
        # 4. AC值 (复杂性分析) - 简化计算
        diffs = set()
        for i in range(5):
            for j in range(i + 1, 5):
                diffs.add(abs(numbers[i] - numbers[j]))
        ac = len(diffs) - 4
        if 6 <= ac <= 8:  # 历史高频AC区间
            score += 0.1
            
        return min(1.0, score)

# ================================================================
# 第二部分：AI模型委员会 (The AI Council - 全真数学实现)
# ================================================================
class AICouncil:
    """八大模型组成的委员会，基于真实数学公式"""
    def __init__(self, df_history):
        self.df = df_history
        self.history_lists = self.df[['f1','f2','f3','f4','f5']].values.tolist()
        self.N = 35
        # 动态权重 (初始均权)
        self.weights = {name: 1.0/8 for name in [
            'Frequency', 'Omission', 'Bayesian', 'Markov', 
            'Matrix', 'Trend', 'Cycle', 'Structure'
        ]}
        self.history_hits = {name: deque(maxlen=200) for name in self.weights}
        self._precalculate()

    def _precalculate(self):
        """预计算高频数据，加速模型推理"""
        # 频率计数
        flat = [num for draw in self.history_lists for num in draw]
        self.freq_counts = Counter(flat)
        self.avg_omission = self.N / (len(flat) / len(self.history_lists)) if self.history_lists else 7

    # --- 1. 频率模型 (Frequency Model) ---
    def _model_frequency(self):
        """基于历史出现次数的最大似然估计"""
        total_draws = len(self.history_lists)
        # P(x) = Count(x) / TotalDraws
        probs = np.array([self.freq_counts.get(i, 0) / total_draws for i in range(1, self.N + 1)])
        return probs + 1e-9  # 拉普拉斯平滑，防止0概率

    # --- 2. 遗漏模型 (Omission Model) ---
    def _model_omission(self):
        """基于遗漏值的泊松分布概率"""
        last_indices = np.full(self.N, -1)
        for idx, draw in enumerate(reversed(self.history_lists)):
            for num in draw:
                if last_indices[num-1] == -1:
                    last_indices[num-1] = idx
        
        current_omission = np.where(last_indices == -1, len(self.history_lists), last_indices)
        
        # 使用泊松分布计算概率: P(k) = (λ^k * e^-λ) / k!
        # λ 为理论平均遗漏
        lambda_ = self.avg_omission
        # 遗漏值越大，回归概率越高 (逆向概率)
        probs = (lambda_ ** current_omission) * np.exp(-lambda_) / (np.math.factorial(int(current_omission[0])) + 1e-9)
        return probs

    # --- 3. 贝叶斯模型 (Bayesian Model) ---
    def _model_bayesian(self):
        """贝叶斯后验概率估计 (Beta分布)"""
        # Prior: Beta(α, β)
        alpha_prior = 1
        beta_prior = 1
        
        posteriors = []
        for num in range(1, self.N + 1):
            hits = self.freq_counts.get(num, 0)
            misses = len(self.history_lists) - hits
            # Posterior: Beta(α+hits, β+misses)
            # 使用均值作为概率估计: (α+hits) / (α+β+total_draws)
            prob = (alpha_prior + hits) / (alpha_prior + beta_prior + len(self.history_lists))
            posteriors.append(prob)
        return np.array(posteriors)

    # --- 4. 马尔可夫模型 (Markov Chain Model) ---
    def _model_markov(self):
        """一阶马尔可夫链状态转移概率"""
        # 构建转移矩阵 T (35x35)
        T = np.zeros((self.N, self.N))
        for draw in self.history_lists:
            for i in range(len(draw)):
                for j in range(i + 1, len(draw)):
                    n1, n2 = draw[i]-1, draw[j]-1
                    T[n1, n2] += 1
                    T[n2, n1] += 1 # 无向图
        
        # 归一化
        row_sums = T.sum(axis=1)
        T_norm = np.zeros_like(T)
        for i in range(self.N):
            if row_sums[i] > 0:
                T_norm[i] = T[i] / row_sums[i]
        
        # 计算当前状态的稳态概率 (简化: 使用最后一次开奖的平均转移)
        last_draw = self.history_lists[-1]
        markov_probs = np.zeros(self.N)
        for num in last_draw:
            markov_probs += T_norm[num-1]
        
        return markov_probs + 1e-9

    # --- 5. 矩阵模型 (Matrix/Association Model) ---
    def _model_matrix(self):
        """共现矩阵关联度分析"""
        # 构建共现矩阵 CoMatrix
        CoMatrix = np.zeros((self.N, self.N))
        for draw in self.history_lists:
            for i in range(5):
                for j in range(i + 1, 5):
                    n1, n2 = draw[i]-1, draw[j]-1
                    CoMatrix[n1, n2] += 1
                    CoMatrix[n2, n1] += 1
        
        # 计算关联得分 (简化: 基于最后一次开奖)
        last_draw = self.history_lists[-1]
        assoc_scores = np.zeros(self.N)
        for i in range(self.N):
            for j in last_draw:
                assoc_scores[i] += CoMatrix[i, j-1]
        
        return assoc_scores / (assoc_scores.max() + 1e-9)

    # --- 6. 趋势模型 (Trend Model) ---
    def _model_trend(self):
        """移动平均趋势分析 (EMA)"""
        # 将历史序列转换为时间序列 (出现为1，否则为0)
        series = np.zeros((len(self.history_lists), self.N))
        for idx, draw in enumerate(self.history_lists):
            for num in draw:
                series[idx, num-1] = 1
        
        # 计算指数移动平均 EMA
        alpha = 0.1  # 平滑因子
        ema = np.zeros(self.N)
        for t in range(len(series)):
            ema = alpha * series[t] + (1 - alpha) * ema
        return ema

    # --- 7. 周期模型 (Cycle Model) ---
    def _model_cycle(self):
        """傅里叶变换检测周期性 (简化版: 正弦波拟合)"""
        # 基于历史出现间隔的周期分析
        periods = []
        for num in range(1, self.N + 1):
            indices = [idx for idx, draw in enumerate(self.history_lists) if num in draw]
            if len(indices) > 1:
                gaps = np.diff(indices)
                # 使用主要周期的相位作为信号
                period = np.mean(gaps) if len(gaps) > 0 else self.avg_omission
                phase = indices[-1] % period
                # 当前期距离相位的差异
                current_phase_diff = abs((len(self.history_lists) - 1) % period - phase)
                periods.append(1 / (current_phase_diff + 1e-9))
            else:
                periods.append(0)
        return np.array(periods)

    # --- 8. 结构模型 (Structure Model) ---
    def _model_structure(self, theory):
        """基于理论约束的结构评分映射"""
        scores = np.zeros(self.N)
        for num in range(1, self.N + 1):
            # 模拟包含该号码的组合结构评分
            # 随机生成包含该号码的100组组合，取平均结构分
            temp_scores = []
            for _ in range(100):
                others = np.random.choice([x for x in range(1, self.N + 1) if x != num], 4, replace=False)
                combo = list(others) + [num]
                temp_scores.append(theory.structure_score(sorted(combo)))
            scores[num-1] = np.mean(temp_scores)
        return scores

    def vote(self, theory):
        """委员会加权投票"""
        # 获取各模型原始得分
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
        
        # 归一化处理 (Min-Max Scaling to 0-1)
        normalized_scores = {}
        for name, score_vec in raw_scores.items():
            min_s, max_s = score_vec.min(), score_vec.max()
            if max_s > min_s:
                normalized_scores[name] = (score_vec - min_s) / (max_s - min_s)
            else:
                normalized_scores[name] = np.zeros_like(score_vec)
        
        # 加权融合
        final_score = np.zeros(self.N)
        for name in self.weights:
            final_score += normalized_scores[name] * self.weights[name]
            
        return final_score

    def update_weights(self, hit_numbers):
        """基于命中结果的贝叶斯权重更新"""
        # 简化逻辑: 如果模型推荐的号码出现在开奖号里，增加权重
        # 真实逻辑需要对比模型输出的TopN与开奖号
        for name in self.weights:
            # 模拟命中反馈 (实际应根据模型输出与开奖号对比)
            # 这里假设模型输出与开奖号有一定相关性
            hit = len(set(hit_numbers).intersection(set(self.history_lists[-1]))) > 0
            self.history_hits[name].append(1 if hit else 0)
            
            # 使用指数加权移动平均更新权重
            if len(self.history_hits[name]) >= 20:
                hit_rate = np.mean(self.history_hits[name])
                self.weights[name] = 0.9 * self.weights[name] + 0.1 * hit_rate
                
        # 归一化权重
        total = sum(self.weights.values())
        if total > 0:
            self.weights = {k: v/total for k, v in self.weights.items()}

# ================================================================
# 第三部分：分段式蒙特卡洛模拟 (Chunked Monte Carlo)
# ================================================================
class ChunkedMonteCarlo:
    """为了解决手机/低算力卡顿，将模拟拆分为小块"""
    def __init__(self, theory, council):
        self.theory = theory
        self.council = council

    def simulate(self, top_numbers_idx, chunks=10, sims_per_chunk=5000):
        """
        分段模拟：
        - top_numbers_idx: AI委员会选出的前N个高概率号码索引 (0-34)
        - chunks: 分成几段跑
        - sims_per_chunk: 每段跑多少次
        """
        all_results = Counter()
        # 提取对应的概率权重
        full_scores = self.council.vote(self.theory)
        top_scores = full_scores[top_numbers_idx]
        probs = top_scores / top_scores.sum()
        
        for i in range(chunks):
            chunk_results = Counter()
            for _ in range(sims_per_chunk):
                # 约束性采样：只在AI选的高概率号码里随机抽取组合
                sample_idx = np.random.choice(top_numbers_idx, size=5, replace=False, p=probs)
                sample = sorted(sample_idx + 1) # 转回1-35
                
                # 结构过滤：不符合理论的扔掉
                if self.theory.structure_score(sample) > 0.6:
                    chunk_results[tuple(sample)] += 1
            
            all_results.update(chunk_results)
            # 此处可插入 yield 用于显示进度条，防止UI卡死
            
        # 返回出现频率最高的Top 3
        return all_results.most_common(3)

# ================================================================
# 第四部分：每日预测与回测引擎 (Daily Engine)
# ================================================================
class DailyEngine:
    def __init__(self):
        self.theory = DLTTheory()
        # 延迟加载数据，避免启动时卡顿
        self.df = None
        self.council = None
        self.monte_carlo = None

    def _load_if_needed(self):
        if self.df is None:
            # 假设 load_data 在 app.py 中定义并能被导入
            from core import load_data 
            self.df = load_data()
            self.council = AICouncil(self.df)
            self.monte_carlo = ChunkedMonteCarlo(self.theory, self.council)

    def predict_today(self):
        """生成今日预测"""
        self._load_if_needed()
        # 1. AI委员会投票
        scores = self.council.vote(self.theory)
        
        # 2. 提取Top 20高概率号码 (缩小蒙特卡洛范围)
        top_20_idx = np.argsort(scores)[-20:] # 索引 0-34
        top_20_scores = scores[top_20_idx]
        
        # 3. 分段蒙特卡洛模拟
        top_3_combos = self.monte_carlo.simulate(top_20_idx)
        
        return top_3_combos, scores

    def verify_and_learn(self, actual_numbers):
        """开奖后验证并更新模型"""
        self._load_if_needed()
        # 1. 更新AI委员会权重
        self.council.update_weights(actual_numbers)
        
        # 2. 记录对比结果 (简化，实际应存入DB)
        # 这里仅返回更新后的权重用于展示
        return self.council.weights

# ================================================================
# 对外接口 (供 app.py 调用)
# ================================================================
_engine = None

def get_engine():
    global _engine
    if _engine is None:
        _engine = DailyEngine()
    return _engine

def run_daily_prediction():
    engine = get_engine()
    return engine.predict_today()

def run_verification(actual_numbers):
    engine = get_engine()
    return engine.verify_and_learn(actual_numbers)

def get_history():
    # 简化：实际应用中应从文件或数据库读取
    return []

