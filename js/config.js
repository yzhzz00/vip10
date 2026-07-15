window.V110_CONFIG = {


    version:"DLT AI CORE V110 FINAL",


    // 数据文件

    dataFile:"data/dlt.txt",



    // 训练窗口

    trainWindow:500,



    // 历史考试范围

    examRanges:[

        100,

        500,

        1000

    ],




    // Monte Carlo

    monteCarloTotal:100000,


    monteCarloBatch:10000,





    // 大乐透范围

    frontMax:35,

    backMax:12,





    // 默认模式

    mode:"stable",



    // 模型权重

    weights:{


        frequency:1,


        trend:1,


        missing:1,


        bayes:1,


        markov:1,


        matrix:1,


        theory:1,


        antiHuman:0.5,


        rhythm:1



    }





};