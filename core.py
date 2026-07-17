import pandas as pd
import numpy as np
from collections import deque

def load_data():
    # 强制指定列名，不管CSV里原来有没有，我都给你定死
    cols = ['issue','date','f1','f2','f3','f4','f5','b1','b2']
    df = pd.read_csv('data.csv', header=0, names=cols, usecols=range(9))
    # 把前区后区合成列表，方便后面用
    df['front'] = df[['f1','f2','f3','f4','f5']].values.tolist()
    df['back'] = df[['b1','b2']].values.tolist()
    return df

def calc_features(history_window):
    if len(history_window) < 50:
        return np.zeros(35)
    recent = history_window[-50:]
    flat = [num for draw in recent for num in draw]
    freq = np.bincount(flat, minlength=36)[1:]
    omission = np.zeros(35)
    for num in range(1,36):
        for i in range(len(recent)-1,-1,-1):
            if num in recent[i]:
                omission[num-1] = len(recent)-1 - i
                break
        else:
            omission[num-1] = len(recent)
    avg_omission = 7
    omission_score = 1 / (np.abs(omission - avg_omission) + 1)
    return freq * 0.7 + omission_score * 0.3

def walk_forward_backtest(df, train_window=500):
    results = []
    model_weights = {'freq':0.25,'omission':0.25,'trend':0.25,'structure':0.25}
    hit_history = {k:deque(maxlen=100) for k in model_weights}
    for i in range(train_window, len(df)):
        train_data = df['front'].iloc[i-train_window:i].tolist()
        actual = df['front'].iloc[i]
        feature_scores = calc_features(train_data)
        predicted = np.argsort(feature_scores)[-5:] + 1
        hit_count = len(set(predicted) & set(actual))
        results.append(hit_count)
        for k in model_weights:
            hit_history[k].append(1 if hit_count>=2 else 0)
            if len(hit_history[k])>=20:
                hit_rate = np.mean(hit_history[k])
                model_weights[k] = max(0.1, min(0.4, hit_rate))
        total = sum(model_weights.values())
        model_weights = {k:v/total for k,v in model_weights.items()}
        if i%50==0:
            print(f"回测第{i}期，平均命中：{np.mean(results[-50:]):.2f}")
    return results, model_weights

def calc_stats(results):
    results = np.array(results)
    avg_hit = np.mean(results)
    random_avg = 5*(5/35)
    improvement = (avg_hit - random_avg)/random_avg*100
    print(f"平均命中：{avg_hit:.2f}，较随机提升：{improvement:.1f}%")
    return avg_hit, improvement
