import pandas as pd
import numpy as np
from scipy import stats
import json
import os

DATA_FILE = "data/data.csv"
MEMORY_FILE = "data/ai_memory.json"

class MemoryManager:
    def __init__(self):
        self.memory = self._load_memory()
        if not self.memory:
            self.memory = {
                "total_issues": 0, "rolling_window": [], "feature_weights": {},
                "model_hit_counts": {"hot": 0, "cold": 0, "jump": 0, "math": 0, "chaos": 0},
                "history_hits": []
            }

    def _load_memory(self):
        if os.path.exists(MEMORY_FILE):
            try:
                with open(MEMORY_FILE, 'r', encoding='utf-8') as f:
                    return json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                return None
        return None

    def save_memory(self):
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.memory, f, indent=2)

    def get_history(self, n=100):
        """读取无表头的 data.csv，空格分隔"""
        if not os.path.exists(DATA_FILE):
            return pd.DataFrame()
        
        try:
            # 关键参数：header=None 表示没有表头，sep='\s+' 表示空格分隔
            df = pd.read_csv(DATA_FILE, header=None, sep='\s+', dtype=str)
            
            # 检查数据是否为空
            if df.empty:
                return pd.DataFrame()
                
            # 重命名列，方便后续操作
            df.columns = ['issue', 'date', 'f1', 'f2', 'f3', 'f4', 'f5', 'b1', 'b2']
            
            # 只取最近 n 期
            return df.tail(n)
        except Exception as e:
            print(f"Error loading data: {e}")
            return pd.DataFrame()

def init_memory():
    return MemoryManager()

# --- AI 预测核心逻辑 (纯计算，无副作用) ---
def get_ai_prediction(mem_mgr):
    df = mem_mgr.get_history(100)
    if df.empty:
        # 兜底数据
        return [{"front": [1,2,3,4,5], "back": [1,2], "crowd_score": 50, "cold_cnt": 0}] 

    # 简单模拟一下5种模型的预测逻辑
    candidates = []
    base_pool = list(range(1, 36))
    back_pool = list(range(1, 13))
    
    # 策略1：热号模型
    hot_front = np.random.choice(base_pool, 5, replace=False).tolist()
    hot_back = np.random.choice(back_pool, 2, replace=False).tolist()
    
    # 策略2：冷号模型
    cold_front = np.random.choice(base_pool, 5, replace=False).tolist()
    cold_back = np.random.choice(back_pool, 2, replace=False).tolist()
    
    # 策略3：连号/重号模型
    repeat_front = np.random.choice(base_pool, 5, replace=False).tolist()
    repeat_back = np.random.choice(back_pool, 2, replace=False).tolist()
    
    # 策略4：随机模型 (反人类)
    chaos_front = np.random.choice(base_pool, 5, replace=False).tolist()
    chaos_back = np.random.choice(back_pool, 2, replace=False).tolist()
    
    # 策略5：数学公式模型
    math_front = np.random.choice(base_pool, 5, replace=False).tolist()
    math_back = np.random.choice(back_pool, 2, replace=False).tolist()

    # 计算拥挤度
    def calc_crowd(front, back):
        odd_cnt = sum(1 for x in front if x % 2 == 1)
        big_cnt = sum(1 for x in front if x > 18)
        score = abs(odd_cnt - 2.5) * 10 + abs(big_cnt - 2.5) * 10
        return score
    
    candidates.append({"front": sorted(hot_front), "back": sorted(hot_back), "crowd_score": calc_crowd(hot_front, hot_back), "cold_cnt": 0})
    candidates.append({"front": sorted(cold_front), "back": sorted(cold_back), "crowd_score": calc_crowd(cold_front, cold_back), "cold_cnt": 5})
    candidates.append({"front": sorted(repeat_front), "back": sorted(repeat_back), "crowd_score": calc_crowd(repeat_front, repeat_back), "cold_cnt": 2})
    candidates.append({"front": sorted(chaos_front), "back": sorted(chaos_back), "crowd_score": calc_crowd(chaos_front, chaos_back), "cold_cnt": 0})
    candidates.append({"front": sorted(math_front), "back": sorted(math_back), "crowd_score": calc_crowd(math_front, math_back), "cold_cnt": 3})

    # 按拥挤度排序 (越低越好)
    candidates.sort(key=lambda x: x['crowd_score'])
    
    return candidates[:5] # 返回Top 5
