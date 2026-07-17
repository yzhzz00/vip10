import streamlit as st
from core import load_data, walk_forward_backtest, calc_stats
import pandas as pd

st.set_page_config(page_title="DLT-AI-CORE VIP", layout="wide")
st.title("🎯 DLT-AI-CORE VIP 回测系统")

# 侧边栏控制
st.sidebar.header("⚙️ 回测设置")
train_window = st.sidebar.slider("训练窗口大小（期）", 300, 800, 500)
run_backtest = st.sidebar.button("🚀 启动滚动回测", type="primary")

if run_backtest:
    with st.spinner("加载数据并启动回测..."):
        # 1. 加载数据
        df = load_data()
        st.sidebar.success(f"加载{len(df)}期历史数据成功")
        
        # 2. 运行滚动回测
        results, final_weights = walk_forward_backtest(df, train_window)
        
        # 3. 计算统计指标
        avg_hit, improvement = calc_stats(results)
        
        # 4. 显示结果
        st.success("回测完成！")
        
        col1, col2, col3 = st.columns(3)
        col1.metric("平均命中数", f"{avg_hit:.2f}", f"{improvement:.1f}% vs 随机")
        col2.metric("最终模型权重", f"{len(final_weights)}个模型")
        col3.metric("训练窗口", f"{train_window}期")
        
        # 显示命中率走势
        st.subheader("📈 命中率走势（滚动50期平均）")
        rolling_hit = pd.Series(results).rolling(50).mean()
        st.line_chart(rolling_hit)
        
        # 显示最终模型权重
        st.subheader("🤖 最终模型权重（自主学习结果）")
        st.bar_chart(pd.DataFrame.from_dict(final_weights, orient='index', columns=['权重']))
        
        # 显示最近10期命中数
        st.subheader("📋 最近10期命中数")
        st.table(pd.DataFrame({"期数": range(len(results)-10, len(results)), "命中数": results[-10:]}))

else:
    st.info("👈 点击左侧「启动滚动回测」，系统会自动用历史数据验证策略有效性")
    st.warning("""
    ⚠️ 系统说明：
    1. 完全基于滚动前向回测，无未来函数
    2. 模型权重会根据命中率自主学习调整
    3. 所有结果均为历史回测数据，不构成购彩建议
    """)
