/**
 * DLT-AI-CORE-VIP 配置文件
 */

module.exports = {

    // 系统名称
    name: "DLT-AI-CORE-VIP",

    // 当前版本
    version: "1.0.0",

    // 服务端口
    port: 3000,


    // 数据路径
    dataFile:
        "./data/dlt_history.txt",


    // 结果保存
    resultFile:
        "./storage/result.json",


    // 默认回测期数
    backtestPeriod: 1000,


    // 模型参数
    model: {

        // 历史权重
        historyWeight: 0.25,

        // 遗漏周期权重
        missingWeight: 0.20,

        // 趋势权重
        trendWeight: 0.20,

        // 结构权重
        structureWeight: 0.20,

        // 随机扰动
        randomWeight: 0.15

    }

};
