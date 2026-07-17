import streamlit as st
from core import load_data, walk_forward_backtest, calc_stats
import pandas as pd

st.set_page_config(page_title="DLT-AI-CORE VIP", layout="wide")
st.title("🎯 DLT-AI-CORE VIP 回测系统")

st.sidebar.header("⚙️ 回测设置")
train_window = st.sidebar.slider("训练窗口（期）", 300, 800, 500)
run = st.sidebar.button("🚀 启动回测", type="primary")

if run:
    with st.spinner("加载数据中..."):
        df = load_data()
        st.sidebar.success(f"加载{len(df)}期数据成功")
        results, weights = walk_forward_backtest(df, train_window)
        avg_hit, imp = calc_stats(results)
        
        col1,col2,col3 = st.columns(3)
        col1.metric("平均命中数", f"{avg_hit:.2f}", f"+{imp:.1f}%")
        col2.metric("模型数量", len(weights))
        col3.metric("训练窗口", train_window)
        
        st.subheader("📈 命中率走势")
        st.line_chart(pd.Series(results).rolling(50).mean())
        
        st.subheader("🤖 模型权重")
        st.bar_chart(pd.DataFrame.from_dict(weights, orient='index', columns=['权重']))
else:
    st.info("👈 左侧设置参数后启动回测")
    st.warning("⚠️ 纯历史回测，不构成购彩建议")
