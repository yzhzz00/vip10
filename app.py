import streamlit as st
from core import load_data, run_daily_prediction, run_verification, get_history
import pandas as pd

st.set_page_config(page_title="DLT-AI-CORE VIP V2.0", layout="wide")
st.title("🎯 DLT-AI-CORE VIP | 真·AI预测系统")

# 加载数据
df = load_data()

tab1, tab2, tab3 = st.tabs(["📊 今日预测", "📜 历史对战", "⚙️ AI委员会"])

with tab1:
    st.header("AI委员会决策 TOP3")
    if st.button("🚀 启动今日预测 (分段蒙特卡洛)", type="primary"):
        with st.spinner("AI委员会投票中... (分段计算防止卡顿)"):
            top3 = run_daily_prediction(df)
            st.session_state['today_pred'] = top3
        
    if 'today_pred' in st.session_state:
        for i, (combo, freq) in enumerate(st.session_state['today_pred']):
            st.subheader(f"No.{i+1} 候选组合")
            st.write(f"号码: {sorted(combo)} | 模拟出现频次: {freq}")

    st.divider()
    st.header("开奖验证与自主学习")
    actual = st.text_input("输入今晚开奖号码 (逗号分隔, e.g. 1,5,12,23,31)")
    if st.button("验证并更新模型权重"):
        if actual:
            actual_list = [int(x.strip()) for x in actual.split(',')]
            result = run_verification(df, actual_list)
            st.success(f"验证完成! 本轮命中数: {result['hits']}")
            st.write("AI委员会权重已更新:", result)

with tab2:
    st.header("历史预测 vs 实际开奖")
    history = get_history()
    if history:
        for record in reversed(history):
            st.write(f"日期:{record['date']} | 预测:{record['pred']} | 实际:{record['actual']} | 命中:{record['hits']}")
    else:
        st.info("暂无历史记录，今晚预测并验证后将自动生成。")

with tab3:
    st.header("AI委员会动态权重")
    engine = get_engine()
    weights_df = pd.DataFrame.from_dict(engine.council.weights, orient='index', columns=['权重'])
    st.bar_chart(weights_df)
    st.write("权重越高，代表该模型在近期历史验证中表现越好。")

