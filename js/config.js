window.DLT_CONFIG = {


    version:"DLT-AI-CORE-V1.1",



    // 数据

    dataFile:"data/dlt.txt",



    // 大乐透规则

    frontMax:35,

    backMax:12,

    frontCount:5,

    backCount:2,



    /*
    =====================
    AI模型权重
    =====================
    */


    modelWeights:{


        trend:0.15,


        matrix:0.18,


        structure:0.15,


        markov:0.12,


        bayes:0.10,


        missing:0.08,


        frequency:0.07,


        sum:0.05,


        shape:0.05,


        antiHuman:0.05


    },





    /*
    =====================
    手机计算参数
    =====================
    */


    mobile:{


        // 候选号码数量

        numberPool:15,


        // 组合数量

        combinations:100,


        // 输出数量

        outputTop:10,


        // 每批计算量

        batchSize:100,


        // 释放UI时间

        delay:20


    },









    /*
    =====================
    Monte Carlo
    =====================
    */


    monteCarlo:{


        normal:5000,


        deep:20000,


        training:1000


    },









    /*
    =====================
    滚动学习
    =====================
    */


    training:{


        window:500,


        batchPeriod:30,


        maxWeightChange:0.03



    },








    /*
    =====================
    矩阵缓存
    =====================
    */


    matrix:{


        recentPeriod:500


    }



};