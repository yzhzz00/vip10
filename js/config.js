window.DLT_CONFIG = {


    // 系统版本

    version: "DLT-AI-CORE-V1",



    // 数据文件

    dataFile: "data/dlt.txt",



    // 大乐透规则

    frontCount: 5,

    frontMax: 35,

    backCount: 2,

    backMax: 12,



    // =====================
    // AI模型初始权重
    // =====================


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





    // =====================
    // 训练参数
    // =====================


    training:{


        // 滚动窗口

        shortWindow:100,


        middleWindow:500,


        longWindow:0,



        // 每次训练批量

        batchSize:30,



        // 防止手机卡死

        pauseTime:100



    },







    // =====================
    // Monte Carlo参数
    // =====================


    monteCarlo:{



        normalSimulation:100000,



        deepSimulation:1000000,



        trainingSimulation:5000,



        batch:500



    },







    // =====================
    // 候选池
    // =====================


    candidate:{



        // 单号保留数量

        frontPool:20,



        // 组合数量

        combinations:5000,



        outputTop:10



    },








    // =====================
    // 学习限制
    // =====================


    learning:{



        maxWeightChange:0.03,



        minModelScore:40



    }




};