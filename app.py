import streamlit as st
import numpy as np
from core import load_data, get_ai_prediction

# 页面配置
st.set_page_config(page_title="DLT-AI-CORE VIP", layout="wide")
st.title("🎯 DLT-AI-CORE VIP 真·AI预测系统")

# 加载数据
try:
    df = load_data()
    st.sidebar.success(f"数据加载成功 | 共{len(df)}期历史数据")
except Exception as e:
    st.error(f"数据异常：{e}")
    st.stop()

# 标签页
tab1, tab2 = st.tabs(["📊 今日预测", "📈 号码概率热力图"])

with tab1:
    st.header("AI委员会TOP3候选组合")
    if st.button("🚀 启动AI预测", type="primary"):
        with st.spinner("AI委员会投票中...（算力裁剪版，避免卡顿）"):
            try:
                top3, scores = get_ai_prediction()
                st.session_state.top3 = top3
                st.session_state.scores = scores
                st.success("预测完成！")
            except Exception as e:
                st.error(f"预测失败：{e}")

    if 'top3' in st.session_state:
        for i, (combo, cnt) in enumerate(st.session_state.top3):
            st.subheader(f"第{i+1}候选")
            st.write(f"号码：{sorted(combo)} | 模拟出现频次：{cnt}")

with tab2:
    st.header("AI号码概率评分（越高越值得关注）")
    if 'scores' in st.session_state:
        score_df = pd.DataFrame({
            '号码': range(1, 36),
            'AI评分': st.session_state.scores
        }).set_index('号码')
        st.bar_chart(score_df)
    else:
        st.info("点击左侧「启动AI预测」生成热力图")

st.divider()
st.caption("⚠️ 本系统为历史数据统计工具，不构成购彩建议 | 纯技术演示")
