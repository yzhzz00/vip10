import pandas as pd
import numpy as np
from collections import deque

# ================== 1. 读数据 ==================
def load_data():
    df = pd.read_csv('data.csv')
    # 把前区5个号码合并成一个列表，方便处理
    df['front'] = df[['front1','front2','front3','front4','front5']].values.tolist()
    return df

# ================== 2. 特征计算（非随机，纯统计） ==================
def calc_features(history_window):
    """
    输入：最近N期的历史开奖数据（列表）
    输出：每个号码的特征得分（频率+遗漏）
    """
    if len(history_window) < 50:  # 至少需要50期数据才有统计意义
        return np.zeros(35)
    
    # 1. 频率特征：最近50期每个号码出现的次数
    recent = history_window[-50:]
    flat = [num for draw in recent for num in draw]
    freq = np.bincount(flat, minlength=36)[1:]  # 号码1-35，所以取[1:]
    
    # 2. 遗漏特征：当前号码距离上次出现的期数
    omission = np.zeros(35)
    for num in range(1, 36):
        # 倒着找最近一次出现的位置
        for i in range(len(recent)-1, -1, -1):
            if num in recent[i]:
                omission[num-1] = len(recent)-1 - i
                break
        else:
            omission[num-1] = len(recent)  # 最近50期没出现
    
    # 3. 特征融合（你可以后面调权重，现在先固定）
    # 频率越高得分越高，遗漏越接近平均遗漏得分越高
    avg_omission = 35 / 5  # 理论平均遗漏（35个号选5个）
    omission_score = 1 / (abs(omission - avg_omission) + 1)  # 越接近平均得分越高
    final_score = freq * 0.7 + omission_score * 0.3  # 频率和遗漏的权重
    
    return final_score

# ================== 3. 滚动前向回测（核心！杜绝未来函数） ==================
def walk_forward_backtest(df, train_window=500):
    """
    滚动回测：用前500期数据训练，预测第501期，再滚到下一期
    返回：每期的命中数、模型权重变化
    """
    results = []
    # 模型权重（动态进化，初始均等）
    model_weights = {
        'freq': 0.25,   # 频率模型权重
        'omission': 0.25,# 遗漏模型权重
        'trend': 0.25,   # 趋势模型权重
        'structure': 0.25# 结构模型权重
    }
    # 记录最近100期的命中率，用来动态调整权重
    hit_history = {k: deque(maxlen=100) for k in model_weights.keys()}
    
    # 从第train_window期开始滚动
    for i in range(train_window, len(df)):
        # 严格切割：训练数据绝对不包含当前预测期的数据！
        train_data = df['front'].iloc[i-train_window:i].tolist()
        actual = df['front'].iloc[i]  # 当前期的真实开奖号码
        
        # 1. 计算特征得分（所有模型的基础）
        feature_scores = calc_features(train_data)
        
        # 2. 选前5个得分最高的号码作为预测结果（非随机！）
        predicted = np.argsort(feature_scores)[-5:] + 1  # +1是因为号码从1开始
        
        # 3. 计算命中数（预测和实际的交集数量）
        hit_count = len(set(predicted) & set(actual))
        results.append(hit_count)
        
        # 4. 动态更新模型权重（自主学习！）
        # 这里用简化版：命中数越高，所有模型权重微增，否则微减
        # 后面你可以换成更复杂的贝叶斯更新
        for k in model_weights:
            # 命中数≥2时，给模型正向反馈
            if hit_count >= 2:
                hit_history[k].append(1)
            else:
                hit_history[k].append(0)
            # 按最近100期的平均命中率调整权重
            if len(hit_history[k]) >= 20:  # 至少20期数据才调整
                hit_rate = np.mean(hit_history[k])
                model_weights[k] = max(0.1, min(0.4, hit_rate))  # 权重限制在0.1-0.4之间
        # 归一化权重，确保总和为1
        total = sum(model_weights.values())
        model_weights = {k: v/total for k,v in model_weights.items()}
        
        # 每50期打印一次进度（手机上看得到）
        if i % 50 == 0:
            print(f"已回测{i}期，最近命中率：{np.mean(results[-50:]):.2f}，当前权重：{model_weights}")
    
    return results, model_weights

# ================== 4. 统计指标（验证是否有效） ==================
def calc_stats(results):
    """计算回测统计指标"""
    results = np.array(results)
    avg_hit = np.mean(results)
    random_avg = 5 * (5/35)  # 随机选号的期望命中数（约0.71）
    improvement = (avg_hit - random_avg) / random_avg * 100  # 相对随机的改进率
    
    print(f"\n===== 回测统计 =====")
    print(f"总期数：{len(results)}")
    print(f"平均命中数：{avg_hit:.2f}（随机基准：{random_avg:.2f}）")
    print(f"相对随机改进：{improvement:.1f}%")
    print(f"命中≥2次的期数占比：{np.mean(results>=2)*100:.1f}%")
    print(f"命中≥3次的期数占比：{np.mean(results>=3)*100:.1f}%")
    
    return avg_hit, improvement
