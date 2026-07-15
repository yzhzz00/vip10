window.V110_CONFIG = {

    version: "DLT AI CORE V110 FINAL",

    dataFile: "data/dlt.txt",

    // 历史训练窗口
    trainWindow: 500,


    // Monte Carlo
    monteCarloTotal: 100000,

    monteCarloBatch: 10000,


    // 大乐透范围

    frontMax: 35,

    backMax: 12,


    // 模型权重

    weights: {

        frequency: 1,

        trend: 1,

        missing: 1,

        structure: 1,

        matrix: 1,

        bayes: 1,

        markov: 1,

        antiHuman: 0.5

    }

};