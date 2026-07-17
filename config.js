// DLT-AI-CORE V11 FINAL
// config.js
// 全局系统配置


const config = {


    // =====================
    // 数据配置
    // =====================

    data:{


        file:

        "./data/dlt_history.txt",


        frontMax:35,


        backMax:12


    },





    // =====================
    // 蒙特卡罗配置
    // =====================

    montecarlo:{


        simulations:

        100000,


        batchSize:

        5000


    },







    // =====================
    // 模型权重
    // =====================

    models:{


        frequency:{


            weight:0.20


        },


        trend:{


            weight:0.20


        },


        bayes:{


            weight:0.25


        },


        markov:{


            weight:0.20


        },


        montecarlo:{


            weight:0.15


        }


    },







    // =====================
    // AI学习配置
    // =====================

    learning:{


        adjustRate:

        0.01,



        minModelWeight:

        0.05,



        maxModelWeight:

        0.50,



        eliminateThreshold:

        0.03


    },








    // =====================
    // 回测配置
    // =====================

    backtest:{


        periods:[


            100,


            500,


            1000


        ]


    },








    // =====================
    // 系统
    // =====================

    system:{


        version:

        "V11 FINAL",



        name:

        "DLT-AI-CORE",



        debug:

        false


    }


};



export default config;