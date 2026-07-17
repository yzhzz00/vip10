// DLT-AI-CORE VIP
// config.js
//
// 全局配置中心
//
// 所有模型统一读取这里
// 禁止在模块内重复写参数


const CONFIG = {



    // ======================
    // 系统信息
    // ======================

    SYSTEM:{


        name:

        "DLT-AI-CORE VIP",



        version:

        "V11 FINAL"



    },









    // ======================
    // 路径配置
    // ======================

    PATH:{



        data:

        "./data/dlt_history.txt",




        storage:

        "./storage"




    },









    // ======================
    // 候选生成配置
    // ======================

    CANDIDATE:{



        // 前区候选池数量

        poolFront:

        18,



        // 后区候选池数量

        poolBack:

        8,



        // 初始生成组合数量

        generateCount:

        500



    },









    // ======================
    // 模型权重
    // ======================

    MODEL_WEIGHT:{



        frequency:

        0.20,



        trend:

        0.20,



        bayes:

        0.20,



        markov:

        0.15,



        omission:

        0.15,



        cycle:

        0.10



    },









    // ======================
    // 回测配置
    // ======================

    BACKTEST:{



        start:

        500



    },









    // ======================
    // AI会议配置
    // ======================

    AI_COMMITTEE:{



        members:

        6,



        top:

        10



    }




};



export default CONFIG;