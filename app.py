import streamlit as st
import pandas as pd
from core import load_data, get_ai_prediction, feedback_learning

st.set_page_config(page_title="DLT-AI-CORE | 2800期滚动学习系统", layout="wide")
st.title("🧠 DLT-AI-CORE | 2800期滚动学习预测系统")

@st.cache_resource
def init_memory():
    return load_data()

mem_mgr = init_memory()

with st.sidebar:
    st.header("📊 AI实时状态")
    st.metric("总学习期数", mem_mgr.memory["total_issues"])
    st.metric("滚动窗口", f"最近{len(mem_mgr.memory['rolling_front'])}期")
    st.subheader("🧠 模型动态权重")
    weights_df = pd.DataFrame(list(mem_mgr.memory["weights"].items()), columns=["模型", "权重"])
    st.dataframe(weights_df, hide_index=True, use_container_width=True)

tab1, tab2 = st.tabs(["🎯 预测与反馈", "📈 学习历史"])

with tab1:
    st.header("Step 1: 生成今日预测")
    if st.button("🚀 启动AI委员会投票", type="primary", use_container_width=True):
        with st.spinner("AI正在融合2800期历史规律..."):
            st.session_state.predictions = get_ai_prediction(mem_mgr)
            st.success("预测完成！")

    if "predictions" in st.session_state:
        st.divider()
        st.subheader("今日AI候选组合（5+2）")
        for i, pred in enumerate(st.session_state.predictions):
            col1, col2 = st.columns([3, 1])
            with col1: st.info(f"**第{i+1}候选**：前区 {pred['front']} | 后区 {pred['back']}")
            with col2: st.write(f"置信度：{pred['confidence']:.2%}")

    st.divider()
    st.header("Step 2: 手动录入开奖结果（反馈学习）")
    
    last_issue = 0
    if mem_mgr.memory["history_hits"]:
        last_issue = mem_mgr.memory["history_hits"][-1]["issue"]
    else:
        last_issue = mem_mgr.memory["total_issues"]
        
    issue = st.number_input("📅 期号", min_value=last_issue + 1, value=last_issue + 1, step=1)

    front_cols = st.columns(5)
    front_inputs = [col.number_input(f"前区{i+1}", 1, 35, 1, key=f"f{i}") for i, col in enumerate(front_cols)]
    
    back_cols = st.columns(2)
    back_inputs = [col.number_input(f"后区{i+1}", 1, 12, 1, key=f"b{i}") for i, col in enumerate(back_cols)]
    
    all_inputs = front_inputs + back_inputs
    front_sum = sum(front_inputs)

    if st.button("✅ 确认录入并更新AI权重", type="secondary", use_container_width=True):
        error = False
        if len(set(all_inputs)) != 7:
            st.error("❌ 号码不能重复！"); error = True
        if not 70 <= front_sum <= 130:
            st.warning(f"⚠️ 前区和值{front_sum}超出常规范围(70-130)，请确认！")
        if mem_mgr.memory["history_hits"]:
            last = mem_mgr.memory["history_hits"][-1]
            if sorted(front_inputs) == last["real_front"] and sorted(back_inputs) == last["real_back"]:
                st.error("❌ 与上一期录入号码完全一致，请勿重复提交！"); error = True
        
        if not error:
            with st.spinner("AI正在反思学习..."):
                hit_counts, new_weights = feedback_learning(mem_mgr, int(issue), sorted(front_inputs), sorted(back_inputs))
                st.balloons()
                st.success(f"🎉 第{issue}期录入完成！")
                st.rerun()

with tab2:
    st.header("AI学习履历")
    if mem_mgr.memory["history_hits"]:
        st.dataframe(pd.DataFrame(mem_mgr.memory["history_hits"][-20:]), use_container_width=True)
    else:
        st.info("暂无历史记录，录入一期后即可查看。")

st.divider()
st.caption("⚠️ 免责声明：本系统为统计学研究工具，不构成购彩建议。请理性对待，切勿沉迷。")
