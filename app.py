import streamlit as st
import pandas as pd
import numpy as np
from datetime import datetime

# 关键：从当前目录导入 core 模块
from core import load_data, run_daily_prediction, get_history

st.set_page_config(page_title="DLT-AI-CORE VIP V3.0", layout="wide")
st.title("🎯 DLT-AI-CORE VIP | 真·AI预测系统")

try:
    df = load_data()
    st.sidebar.success(f"数据加载成功 ({len(df)}期)")
except Exception as e:
    st.error(f"数据加载失败: {e}")
    st.stop()

tab1, tab2 = st.tabs(["📊 今日预测", "⚙️ AI委员会"])

with tab1:
    st.header("AI委员会决策 TOP3")
    if st.button("🚀 启动今日预测 (分段蒙特卡洛)", type="primary"):
        with st.spinner("AI委员会投票中... (分段计算防止卡顿)"):
            try:
                top3, scores = run_daily_prediction()
                st.session_state['today_pred'] = top3
                st.session_state['scores'] = scores
            except Exception as e:
                st.error(f"预测失败: {e}")

    if 'today_pred' in st.session_state:
        for i, (combo, freq) in enumerate(st.session_state['today_pred']):
            st.subheader(f"No.{i+1} 候选组合")
            st.write(f"号码: {sorted(combo)} | 模拟出现频次: {freq}")

with tab2:
    st.header("号码概率热力图 (AI评分)")
    if 'scores' in st.session_state:
        score_df = pd.DataFrame({
            '号码': range(1, 36),
            'AI评分': st.session_state['scores']
        }).set_index('号码')
        st.bar_chart(score_df)
    else:
        st.info("点击左侧预测按钮生成热力图")

st.divider()
st.write(f"最后更新: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
