import pandas as pd
import numpy as np
from scipy import stats
import json
import os
import streamlit as st

DATA_FILE = "data/data.csv"
MEMORY_FILE = "data/ai_memory.json"

class MemoryManager:
    def __init__(self):
        self.memory = self._load_memory()
        
        # 🔥【终极修复】如果记忆文件损坏或为空，强制初始化一个健康的
        if not self.memory or not isinstance(self.memory, dict):
            st.warning("⚠️ 检测到记忆文件异常或为空，正在自动重建初始记忆...")
            self.memory = {
                "total_issues": 0, 
                "rolling_window": [], 
                "feature_weights": {"hot": 1.0, "cold": 1.0, "jump": 1.0, "math": 1.0, "chaos": 1.0},
                "model_hit_counts": {"hot": 0, "cold": 0, "jump": 0, "math": 0, "chaos": 0},
                "history_hits": []
            }
            self.save_memory() # 立即保存健康文件，防止下次还报错

    def _load_memory(self):
        """加载记忆文件"""
        if os.path.exists(MEMORY_FILE):
            try:
                with open(MEMORY_FILE, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if not content: # 如果文件存在但里面是空的
                        return None
                    return json.loads(content)
            except (json.JSONDecodeError, FileNotFoundError):
                return None
        return None

    def save_memory(self):
        os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
        with open(MEMORY_FILE, 'w', encoding='utf-8') as f:
            json.dump(self.memory, f, indent=2)

    def _load_full_data(self):
        """读取无表头的 data.csv，空格分隔"""
        if not os.path.exists(DATA_FILE):
            return pd.DataFrame()
            
        try:
            # header=None: 无表头；sep='\s+': 空格分隔；dtype=str: 强制读成字符串防止数字变科学计数法
            df = pd.read_csv(DATA_FILE, header=None, sep='\s+', dtype=str)
            
            # 检查列数是否足够 (至少9列)
            if df.shape[1] < 9:
                return pd.DataFrame()
                
            # 赋予列名，方便后续处理
            df.columns = ['issue', 'date', 'f1', 'f2', 'f3', 'f4', 'f5', 'b1', 'b2'] + list(df.columns[9:])
            
            # 清洗数据：把所有号码转成整数，非法的变成NaN
            for col in ['f1', 'f2', 'f3', 'f4', 'f5', 'b1', 'b2']:
                df[col] = pd.to_numeric(df[col], errors='coerce')
                
            # 剔除包含NaN的行（即数据格式错误的行）
            df.dropna(subset=['issue', 'f1', 'f2', 'f3', 'f4', 'f5', 'b1', 'b2'], inplace=True)
            
            return df
        except Exception as e:
            st.error(f"❌ 读取CSV失败: {e}")
            return pd.DataFrame()

    def get_history(self, n=100):
        """获取最近N期历史数据"""
        df = self._load_full_data()
        if df.empty:
            return pd.DataFrame()
        # 按期号倒序取前N期，然后再倒序回来，保持时间正序
        return df.sort_values('issue', ascending=False).head(n).sort_values('issue')

    def get_last_issue(self):
        """获取最新一期期号"""
        df = self._load_full_data()
        if df.empty:
            return 0
        return int(df['issue'].max())

    def load_data(self):
        """加载数据并入档"""
        df = self._load_full_data()
        if df.empty:
            return pd.DataFrame(), False
            
        # 转换类型，方便计算
        df['issue'] = df['issue'].astype(int)
        for col in ['f1', 'f2', 'f3', 'f4', 'f5', 'b1', 'b2']:
            df[col] = df[col].astype(int)
            
        # 更新总期数和滚动窗口
        current_max_issue = int(df['issue'].max())
        self.memory["total_issues"] = max(self.memory["total_issues"], current_max_issue)
        
        # 只保留最近的200期作为滚动窗口
        self.memory["rolling_window"] = df.sort_values('issue', ascending=False).head(200).to_dict('records')
        
        self.save_memory()
        return df, True

    def calculate_features(self, row):
        """提取特征"""
        features = {}
        # 基础特征
        nums = [row['f1'], row['f2'], row['f3'], row['f4'], row['f5']]
        back_nums = [row['b1'], row['b2']]
        
        features['sum'] = sum(nums)
        features['odd_count'] = sum(1 for x in nums if x % 2 == 1)
        features['even_count'] = 5 - features['odd_count']
        features['big_count'] = sum(1 for x in nums if x > 18)
        features['small_count'] = 5 - features['big_count']
        
        # 连号特征
        nums_sorted = sorted(nums)
        features['has_lianhao'] = 1 if any(nums_sorted[i+1] - nums_sorted[i] == 1 for i in range(4)) else 0
        
        # 重号特征 (与上期对比)
        prev_nums = set()
        if self.memory["rolling_window"] and self.memory["rolling_window"][0]['issue'] != row['issue']:
            prev_nums = set(self.memory["rolling_window"][0].values())
        
        features['repeat_count'] = sum(1 for x in nums if x in prev_nums)
        
        return features

    def feedback_learning(self, issue, front, back):
        """反馈学习，更新权重"""
        # 防止重复录入
        for hit in self.memory["history_hits"]:
            if hit['issue'] == issue:
                return self.memory["model_hit_counts"], False
        
        # 获取当期官方开奖数据
        df = self._load_full_data()
        current_data = df[df['issue'] == issue]
        
        if current_data.empty:
            st.error(f"❌ 未找到期号 {issue} 的开奖数据，无法学习！")
            return self.memory["model_hit_counts"], False
        
        actual_front = sorted([current_data.iloc[0]['f1'], current_data.iloc[0]['f2'], current_data.iloc[0]['f3'], current_data.iloc[0]['f4'], current_data.iloc[0]['f5']])
        actual_back = sorted([current_data.iloc[0]['b1'], current_data.iloc[0]['b2']])
        
        # 计算命中数
        front_hit = len(set(front) & set(actual_front))
        back_hit = len(set(back) & set(actual_back))
        total_hit = front_hit + back_hit
        
        # 记录历史
        self.memory["history_hits"].append({
            "issue": issue,
            "pred_front": front, "pred_back": back,
            "act_front": actual_front, "act_back": actual_back,
            "hit": total_hit
        })
        
        # 简单的权重更新逻辑 (这里用最简单的规则：命中多的加分，没命中的减分)
        # 注意：这里简化了，实际应该按模型细分，这里统一处理
        weight_change = 0.1 if total_hit > 2 else -0.1
        
        # 更新总权重
        for model in self.memory["feature_weights"]:
            self.memory["feature_weights"][model] = max(0.1, self.memory["feature_weights"][model] + weight_change)
            # 记录命中次数
            if total_hit > 2:
                self.memory["model_hit_counts"][model] += 1
        
        self.save_memory()
        return self.memory["model_hit_counts"], True

def init_memory():
    return MemoryManager()

# --- AI 预测核心逻辑 ---
def get_ai_prediction(mem_mgr):
    df = mem_mgr.get_history(100)
    if df.empty:
        return [{"front": [1,2,3,4,5], "back": [1,2], "crowd_score": 50, "cold_cnt": 0}] # 兜底数据

    # 简单模拟一下5种模型的预测逻辑 (实际项目中这里会非常复杂)
    # 为了演示，我们生成几个随机的候选组合
    
    candidates = []
    base_pool = list(range(1, 36))
    back_pool = list(range(1, 13))
    
    # 策略1：热号模型 (多选近期出现频率高的)
    hot_front = np.random.choice(base_pool, 5, replace=False).tolist()
    hot_back = np.random.choice(back_pool, 2, replace=False).tolist()
    
    # 策略2：冷号模型 (多选很久没出的)
    cold_front = np.random.choice(base_pool, 5, replace=False).tolist()
    cold_back = np.random.choice(back_pool, 2, replace=False).tolist()
    
    # 策略3：连号/重号模型
    repeat_front = np.random.choice(base_pool, 5, replace=False).tolist()
    repeat_back = np.random.choice(back_pool, 2, replace=False).tolist()
    
    # 策略4：随机模型 (反人类)
    chaos_front = np.random.choice(base_pool, 5, replace=False).tolist()
    chaos_back = np.random.choice(back_pool, 2, replace=False).tolist()
    
    # 策略5：数学公式模型 (比如和值定胆)
    math_front = np.random.choice(base_pool, 5, replace=False).tolist()
    math_back = np.random.choice(back_pool, 2, replace=False).tolist()

    # 计算拥挤度 (简单用奇偶比和大小比模拟)
    def calc_crowd(front, back):
        odd_cnt = sum(1 for x in front if x % 2 == 1)
        big_cnt = sum(1 for x in front if x > 18)
        # 越接近 2:3 或 3:2 越不拥挤，这里简单归一化
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

