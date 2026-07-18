import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime
from core import init_memory, get_ai_prediction

# --- 学习反馈逻辑 (放在这里，避免循环导入) ---
def feedback_learning(mem_mgr, issue, front_nums, back_nums):
    df = mem_mgr.get_history(500)
    if df.empty:
        return {}, False

    # 找到最新一期历史数据作为基准
    latest_row = df.iloc[-1]
    latest_f = sorted([int(latest_row[f'f{i}']) for i in range(1, 6)])
    latest_b = sorted([int(latest_row[f'b{i}']) for i in range(1, 3)])
    
    # 计算命中数
    hit_f = len(set(front_nums) & set(latest_f))
    hit_b = len(set(back_nums) & set(latest_b))
    total_hit = hit_f + hit_b
    
    # 动态调整权重 (简单的强化学习)
    models = ["hot", "cold", "jump", "math", "chaos"]
    if total_hit > 2:
        # 命中多，给正向反馈
        for model in models:
            mem_mgr.memory["feature_weights"][model] = min(1.0, mem_mgr.memory["feature_weights"].get(model, 0.2) + 0.05)
            if total_hit >= 4: # 大爆发
                mem_mgr.memory["model_hit_counts"][model] += 1
    else:
        # 命中少，给负向反馈
        for model in models:
            mem_mgr.memory["feature_weights"][model] = max(0.05, mem_mgr.memory["feature_weights"].get(model, 0.2) - 0.02)

    # 记录历史
    mem_mgr.memory["history_hits"].append({
        "issue": int(issue), "hit": total_hit, "pred": front_nums + back_nums
    })
    
    # 保持记录长度
    if len(mem_mgr.memory["history_hits"]) > 100:
        mem_mgr.memory["history_hits"].pop(0)
        
    # 更新滚动窗口
    current_features = {
        "front_std": float(np.std(front_nums)),
        "back_sum": sum(back_nums),
        "span": max(front_nums) - min(front_nums)
    }
    mem_mgr.memory["rolling_window"].append(current_features)
    if len(mem_mgr.memory["rolling_window"]) > 50:
        mem_mgr.memory["rolling_window"].pop(0)
        
    mem_mgr.save_memory()
    return mem_mgr.memory["model_hit_counts"], (total_hit >= 3)

# --- 页面配置 ---
st.set_page_config(page_title="🧠 DLT-AI-CORE", layout="wide")
st.title("🧠 DLT-AI-CORE | V10.3 终极修复版")

# 初始化内存
if 'mem_mgr' not in st.session_state:
    st.session_state.mem_mgr = init_memory()

mem_mgr = st.session_state.mem_mgr

# --- 侧边栏：数据与权重 ---
with st.sidebar:
    st.header("📊 系统状态")
    st.metric("总期数", mem_mgr.memory["total_issues"])
    
    st.subheader("⚖️ 模型权重")
    weights = mem_mgr.memory.get("feature_weights", {})
    if not weights:
        weights = {m: 0.2 for m in ["hot", "cold", "jump", "math", "chaos"]}
        
    for model, w in weights.items():
        st.progress(w, text=f"{model.upper()}: {w:.2f}")

# --- 主界面：预测与录入 ---
tab1, tab2 = st.tabs(["🔮 AI 预测", "📝 人工录入"])

with tab1:
    st.subheader("🚀 下一期智能推荐 Top 5")
    
    if st.button("🔄 立即生成预测", type="primary", use_container_width=True):
        with st.spinner("AI正在深度计算..."):
            preds = get_ai_prediction(mem_mgr)
            st.session_state.predictions = preds
            
    if 'predictions' in st.session_state:
        for i, pred in enumerate(st.session_state.predictions):
            st.container(border=True)
            st.write(f"**第{i+1}候选**：前区 {pred['front']} | 后区 {pred['back']}")
            st.write(f"拥挤度：{pred['crowd_score']:.2f}（越低越反人类）| 冷号数：{pred['cold_cnt']}个")

with tab2:
    last_issue = mem_mgr.memory["history_hits"][-1]["issue"] if mem_mgr.memory["history_hits"] else mem_mgr.memory["total_issues"]
    issue = st.number_input("期号", min_value=last_issue + 1, value=last_issue + 1)
    front_cols = st.columns(5)
    front_inputs = [col.number_input(f"前区{i+1}", 1, 35, 1, key=f"f{i}") for i, col in enumerate(front_cols)]
    back_cols = st.columns(2)
    back_inputs = [col.number_input(f"后区{i+1}", 1, 12, 1, key=f"b{i}") for i, col in enumerate(back_cols)]
    
    if st.button("✅ 录入并更新权重", type="secondary", use_container_width=True):
        all_inputs = front_inputs + back_inputs
        if len(set(all_inputs)) != 7:
            st.error("❌ 号码不能重复！")
        elif not 78 <= sum(front_inputs) <= 112:
            st.warning(f"⚠️ 前区和值{sum(front_inputs)}超出范围(78-112)，请确认！")
        else:
            hit_counts, _ = feedback_learning(mem_mgr, int(issue), sorted(front_inputs), sorted(back_inputs))
            st.success("🎉 学习完成！AI权重已更新。")
            st.write("本期各模型命中数：", hit_counts)
            st.rerun()

st.divider()
st.caption("⚠️ 免责声明：本系统为统计学研究工具，不构成购彩建议。请理性对待，切勿沉迷。")
