import streamlit as st
import pandas as pd
from core import load_data, get_ai_prediction, feedback_learning

st.set_page_config(page_title="DLT-AI-CORE V10.2", layout="wide")
st.title("🧠 DLT-AI-CORE | V10.2 反人类预测系统")

@st.cache_resource
def init_memory():
    return load_data()

mem_mgr = init_memory()

with st.sidebar:
    st.header("📊 AI实时状态")
    st.metric("总期数", mem_mgr.memory["total_issues"])
    st.metric("滚动窗口", f"最近{len(mem_mgr.memory['rolling_front'])}期")
    st.subheader("🧠 模型权重")
    weights_df = pd.DataFrame([{"模型": k, "权重": v, "状态": "冷冻" if v == 0.02 else "正常"} for k, v in mem_mgr.memory["weights"].items()])
    st.dataframe(weights_df, hide_index=True, use_container_width=True)

tab1, tab2 = st.tabs(["🎯 预测", "📝 反馈学习"])

with tab1:
    if st.button("🚀 启动AI委员会投票", type="primary", use_container_width=True):
        st.session_state.predictions = get_ai_prediction(mem_mgr)
        st.success("预测完成！")
    
    if "predictions" in st.session_state:
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
