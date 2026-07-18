import streamlit as st
import pandas as pd
import json
import os
from core import load_data, get_ai_prediction, feedback_learning

# ==================== 页面配置 ====================
st.set_page_config(
    page_title="DLT-AI-CORE | 2800期滚动学习系统",
    layout="wide",
    initial_sidebar_state="expanded"
)
st.title("🧠 DLT-AI-CORE | 2800期滚动学习预测系统")

# ==================== 初始化 ====================
@st.cache_resource
def init_memory():
    return load_data()

mem_mgr = init_memory()

# ==================== 侧边栏：AI状态监控 ====================
with st.sidebar:
    st.header("📊 AI实时状态")
    st.metric("总学习期数", mem_mgr.memory["total_issues"])
    st.metric("滚动窗口", f"最近{len(mem_mgr.memory['rolling_front'])}期")
    st.subheader("🧠 模型动态权重")
    weights_df = pd.DataFrame(
        list(mem_mgr.memory["weights"].items()),
        columns=["模型", "权重"]
    )
    st.dataframe(weights_df, hide_index=True, use_container_width=True)
    st.caption("权重越高，代表该模型近期表现越好")

# ==================== 主界面 ====================
tab1, tab2 = st.tabs(["🎯 预测与反馈", "📈 学习历史"])

with tab1:
    st.header("Step 1: 生成今日预测（基于2800期+滚动学习）")
    if st.button("🚀 启动AI委员会投票", type="primary", use_container_width=True):
        with st.spinner("AI正在融合2800期历史规律+最近200期趋势..."):
            try:
                predictions = get_ai_prediction(mem_mgr)
                st.session_state.predictions = predictions
                st.success("预测完成！请等待开奖后录入结果。")
            except Exception as e:
                st.error(f"预测失败：{e}")
    
    if "predictions" in st.session_state:
        st.divider()
        st.subheader("今日AI候选组合（5+2）")
        for i, pred in enumerate(st.session_state.predictions):
            col1, col2, col3 = st.columns([2, 1, 1])
            with col1:
                st.info(f"**第{i+1}候选**：前区 {pred['front']} | 后区 {pred['back']}")
            with col2:
                st.write(f"置信度：{pred['confidence']:.2%}")
            with col3:
                st.write(f"模拟频次：{int(pred['confidence']*MC_SAMPLES)}")
    
    st.divider()
    st.header("Step 2: 手动录入开奖结果（反馈学习）")
    st.caption("请输入最新开奖号码，AI将根据结果调整权重，实现滚动学习")
    
    # 前区5个输入框（1-35）
    st.subheader("🔴 前区（5个号，1-35）")
    front_cols = st.columns(5)
    front_inputs = []
    for i in range(5):
        num = front_cols[i].number_input(
            f"前区{i+1}",
            min_value=1,
            max_value=35,
            value=1,
            step=1,
            key=f"front_{i}",
            label_visibility="collapsed"
        )
        front_inputs.append(int(num))
    
    # 后区2个输入框（1-12）
    st.subheader("🔵 后区（2个号，1-12）")
    back_cols = st.columns(2)
    back_inputs = []
    for i in range(2):
        num = back_cols[i].number_input(
            f"后区{i+1}",
            min_value=1,
            max_value=12,
            value=1,
            step=1,
            key=f"back_{i}",
            label_visibility="collapsed"
        )
        back_inputs.append(int(num))
    
    # 合并所有号码
    all_inputs = front_inputs + back_inputs
    
    if st.button("✅ 确认录入并更新AI权重", type="secondary", use_container_width=True):
        # 校验重复
        if len(set(all_inputs)) != 7:
            st.error("❌ 输入有误：前区和后区号码不能重复！")
        else:
            with st.spinner("AI正在反思学习：更新滚动窗口→调整模型权重..."):
                hit_counts, new_weights = feedback_learning(
                    mem_mgr, sorted(front_inputs), sorted(back_inputs)
                )
                st.balloons()
                st.success("🎉 学习完成！AI权重已更新。")
                # 显示命中情况
                st.subheader("📊 本期模型命中数")
                hit_df = pd.DataFrame(
                    list(hit_counts.items()),
                    columns=["模型", "命中数（前区5个）"]
                )
                st.dataframe(hit_df, hide_index=True, use_container_width=True)
                # 显示新权重
                st.subheader("🧠 更新后的模型权重")
                new_weights_df = pd.DataFrame(
                    list(new_weights.items()),
                    columns=["模型", "新权重"]
                )
                st.dataframe(new_weights_df, hide_index=True, use_container_width=True)
                # 清除预测缓存，下次预测用新权重
                if "predictions" in st.session_state:
                    del st.session_state.predictions
                st.rerun()

with tab2:
    st.header("AI学习履历")
    if mem_mgr.memory["history_hits"]:
        history_df = pd.DataFrame(mem_mgr.memory["history_hits"])
        st.dataframe(history_df, use_container_width=True)
    else:
        st.info("暂无学习历史，录入一期开奖结果后即可查看。")
    
    st.subheader("当前滚动窗口数据（最近200期）")
    if st.checkbox("显示最近10期开奖号"):
        recent = mem_mgr.memory["rolling_front"][-10:]
        recent_back = mem_mgr.memory["rolling_back"][-10:]
        for i in range(len(recent)):
            st.write(f"第{i+1}期：前区 {recent[i]} | 后区 {recent_back[i]}")

st.divider()
st.caption("⚠️ 免责声明：本系统为统计学研究与技术演示工具。彩票本质为独立随机事件，任何算法均无法突破概率论限制。请理性对待，切勿沉迷。")
