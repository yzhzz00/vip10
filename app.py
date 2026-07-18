import streamlit as st
import pandas as pd
from core import load_data, get_ai_prediction, feedback_learning

st.set_page_config(page_title="DLT-AI-CORE | 反人类预测系统", layout="wide")
st.title("🧠 DLT-AI-CORE | 反人类真预测系统")
st.caption("核心逻辑：避开大众选号习惯+动态淘汰模型+三维置信度+大乐透官方理论")

@st.cache_resource
def init_memory():
    return load_data()

mem_mgr = init_memory()

# ==================== 侧边栏：核心状态 ====================
with st.sidebar:
    st.header("📊 AI实时状态")
    st.metric("总学习期数", mem_mgr.memory["total_issues"])
    st.metric("滚动窗口", f"最近{len(mem_mgr.memory['rolling_front'])}期")
    st.subheader("🧠 模型动态权重（含淘汰状态）")
    weights_df = pd.DataFrame([
        {"模型": name, "权重": mem_mgr.memory["weights"][name], 
         "状态": "冷冻" if mem_mgr.memory["weights"][name] == 0.02 else "正常"}
        for name in MODEL_NAMES
    ])
    st.dataframe(weights_df, hide_index=True, use_container_width=True)
    st.subheader("📉 连续命中记录")
    hit_hist_df = pd.DataFrame(mem_mgr.memory["model_hit_history"])
    st.dataframe(hit_hist_df.tail(5), hide_index=True, use_container_width=True)

# ==================== 主界面 ====================
tab1, tab2, tab3 = st.tabs(["🎯 反人类预测", "📝 反馈学习", "📈 学习历史"])

with tab1:
    st.header("Step 1: 生成反人类候选组合")
    st.caption("逻辑：过滤掉热号占比≥80%的大众热门组合，保留含冷号、符合核心理论的组合")
    if st.button("🚀 启动AI委员会投票", type="primary", use_container_width=True):
        with st.spinner("AI正在融合2800期历史规律，生成反人类组合..."):
            st.session_state.predictions = get_ai_prediction(mem_mgr)
            st.success("预测完成！已过滤高拥挤度组合")
    
    if "predictions" in st.session_state:
        st.divider()
        st.subheader("今日Top3反人类候选（5+2）")
        for i, pred in enumerate(st.session_state.predictions):
            with st.container(border=True):
                col1, col2 = st.columns([3, 1])
                with col1:
                    st.markdown(f"**第{i+1}候选**")
                    st.write(f"前区：{pred['front']} | 后区：{pred['back']}")
                    st.write(f"冷号数量：{pred['cold_cnt']}个 | 拥挤度：{pred['crowd_score']:.2f}（越低越反人类）")
                with col2:
                    st.metric("总置信度", f"{pred['confidence']:.2%}")
                    st.write(f"蒙特卡罗：{pred['mc_conf']:.2%}")
                    st.write(f"结构合规：{pred['struct_conf']:.2%}")
                    st.write(f"模型共识：{pred['consensus_conf']:.2%}")

with tab2:
    st.header("Step 2: 手动录入开奖结果（反馈学习）")
    st.caption("逻辑：计算各模型真实命中数，触发淘汰/解冻机制，更新动态权重")
    
    last_issue = mem_mgr.memory["history_hits"][-1]["issue"] if mem_mgr.memory["history_hits"] else mem_mgr.memory["total_issues"]
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
        if not 78 <= front_sum <= 112:
            st.warning(f"⚠️ 前区和值{front_sum}超出官方统计区间[78,112]，请确认！")
        if mem_mgr.memory["history_hits"]:
            last = mem_mgr.memory["history_hits"][-1]["real_front"]
            if sorted(front_inputs) == last:
                st.error("❌ 与上一期录入号码完全一致，请勿重复提交！"); error = True
        
        if not error:
            with st.spinner("AI正在反思学习：更新权重+淘汰机制..."):
                hit_counts, new_weights = feedback_learning(mem_mgr, int(issue), sorted(front_inputs), sorted(back_inputs))
                st.balloons()
                st.success(f"🎉 第{issue}期录入完成！")
                st.subheader("📊 本期各模型真实命中数（前区5个）")
                hit_df = pd.DataFrame([{"模型": k, "命中数": v} for k,v in hit_counts.items()])
                st.dataframe(hit_df, hide_index=True, use_container_width=True)
                st.subheader("🧠 更新后的模型权重")
                new_weights_df = pd.DataFrame([{"模型": k, "新权重": v} for k,v in new_weights.items()])
                st.dataframe(new_weights_df, hide_index=True, use_container_width=True)
                st.rerun()

with tab3:
    st.header("AI学习履历（最近20期）")
    if mem_mgr.memory["history_hits"]:
        hist_df = pd.DataFrame(mem_mgr.memory["history_hits"][-20:])
        st.dataframe(hist_df, use_container_width=True)
    else:
        st.info("暂无历史记录，录入一期后即可查看。")
    
    st.subheader("当前冷冻模型（淘汰区）")
    frozen = [name for name in MODEL_NAMES if mem_mgr.memory["weights"][name] == 0.02]
    if frozen:
        st.warning(f"以下模型已被冷冻（连续5期命中≤0）：{', '.join(frozen)}")
    else:
        st.success("无冷冻模型，所有模型正常运行")

st.divider()
st.caption("⚠️ 免责声明：本系统为统计学研究工具，基于历史数据建模，不构成任何购彩建议。彩票本质为独立随机事件，请理性对待，切勿沉迷。")
