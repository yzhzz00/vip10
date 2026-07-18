import streamlit as st
import numpy as np
import pandas as pd
import json
import os
from core import load_data, get_ai_prediction, update_memory_after_draw

# ==============================================================================
# 页面基础配置
# ==============================================================================
st.set_page_config(page_title="DLT-AI-CORE | 自主学习系统", layout="wide")
st.title("🧠 DLT-AI-CORE | 真·自主学习预测系统")

# 初始化 Session State
if 'prediction_done' not in st.session_state:
    st.session_state.prediction_done = False
if 'last_top3' not in st.session_state:
    st.session_state.last_top3 = []

# ==============================================================================
# 侧边栏：模型权重监控（AI的大脑状态）
# ==============================================================================
with st.sidebar:
    st.header("📊 AI模型权重监控")
    st.caption("权重越高，代表该模型近期表现越好")
    if os.path.exists("ai_memory.json"):
        with open("ai_memory.json", "r") as f:
            memory = json.load(f)
        weights = memory.get("weights", {})
        total_issues = memory.get("total_issues", 0)
        st.write(f"**已学习期数：** `{total_issues}`")
        for name, value in weights.items():
            st.progress(value, text=f"{name}: {value:.3f}")
    else:
        st.warning("AI尚未产生记忆，请先进行预测。")

# ==============================================================================
# Tab 1: 预测与反馈
# ==============================================================================
tab1, tab2 = st.tabs(["🎯 预测与反馈", "📈 预测历史"])

with tab1:
    st.header("Step 1: 生成今日预测")
    if st.button("🚀 启动AI委员会投票", type="primary"):
        with st.spinner("AI正在分析历史数据并投票..."):
            try:
                top3, scores, raw_models, mem = get_ai_prediction()
                st.session_state.last_top3 = top3
                st.session_state.prediction_done = True
                st.success("预测完成！请在下期开奖后录入结果。")
            except Exception as e:
                st.error(f"预测失败: {e}")

    if st.session_state.prediction_done and st.session_state.last_top3:
        st.divider()
        st.subheader("今日 AI 候选组合")
        for i, (combo, freq) in enumerate(st.session_state.last_top3):
            st.info(f"**第 {i+1} 候选：** {sorted(combo)} (模拟频次: {freq})")

        st.divider()
        st.header("Step 2: 手动录入开奖结果（反馈学习）")
        st.caption("请输入最新的真实开奖号码，每个数字一个框。AI将据此调整权重。")
        
        # 创建5个独立的输入框
        cols = st.columns(5)
        real_numbers = []
        for i in range(5):
            num = cols[i].number_input(
                f"前区 {i+1}",
                min_value=1,
                max_value=35,
                value=1,
                step=1,
                key=f"num_{i}"
            )
            real_numbers.append(num)
        
        real_numbers_sorted = sorted(real_numbers)

        if st.button("✅ 确认录入并更新AI权重", type="secondary"):
            if len(set(real_numbers_sorted)) != 5:
                st.error("输入有误：号码不能有重复！")
            else:
                with st.spinner("AI正在反思学习..."):
                    # 调用核心函数更新权重
                    new_weights = update_memory_after_draw(real_numbers_sorted)
                    st.session_state.prediction_done = False # 重置状态
                    
                    st.balloons()
                    st.success(f"学习完成！本期开奖号 {real_numbers_sorted} 已录入。")
                    
                    # 显示本次命中的情况
                    hit_count = 0
                    for combo, _ in st.session_state.last_top3:
                        if set(real_numbers_sorted).intersection(set(combo)):
                            hit_count += len(set(real_numbers_sorted).intersection(set(combo)))
                    
                    st.write(f"**本期与预测组合重合数：** {hit_count} 个")
                    st.json(new_weights)
                    st.rerun() # 刷新页面以更新侧边栏权重

# ==============================================================================
# Tab 2: 历史记录
# ==============================================================================
with tab2:
    st.header("AI学习履历")
    if os.path.exists("ai_memory.json"):
        with open("ai_memory.json", "r") as f:
            memory = json.load(f)
        history = memory.get("history_hits", [])
        if history:
            df_hist = pd.DataFrame(history)
            st.dataframe(df_hist)
        else:
            st.info("暂无学习历史，录入一期开奖结果后即可查看。")
    else:
        st.info("暂无学习历史文件。")

st.divider()
st.caption("⚠️ 本系统为技术演示与统计学研究工具，不构成任何购彩建议。请理性对待。")
