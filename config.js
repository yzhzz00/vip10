// DLT-AI-CORE VIP
// config.js
// 全局系统配置
//
// 所有模块统一读取这里
// 不允许模块自己写路径


import path from "path";
import { fileURLToPath } from "url";



const __filename =

fileURLToPath(

    import.meta.url

);



const __dirname =

path.dirname(

    __filename

);





const config = {



    // ======================
    // 服务配置
    // ======================

    server:{


        port:3000


    },









    // ======================
    // 数据配置
    // ======================

    data:{


        historyFile:

        path.join(

            __dirname,

            "data",

            "dlt_history.txt"

        )


    },









    // ======================
    // storage配置
    // ======================

    storage:{


        weightFile:

        path.join(

            __dirname,

            "storage",

            "weights.json"

        ),



        modelFile:

        path.join(

            __dirname,

            "storage",

            "models.json"

        ),



        cacheFile:

        path.join(

            __dirname,

            "storage",

            "cache.json"

        ),



        learningFile:

        path.join(

            __dirname,

            "storage",

            "learning.json"

        ),



        backtestFile:

        path.join(

            __dirname,

            "storage",

            "backtest.json"

        )



    },









    // ======================
    // 模型初始权重
    // ======================

    model:{


        frequency:1.0,


        trend:1.0,


        bayes:1.0,


        markov:1.0,


        omission:1.0,


        cycle:1.0



    },









    // ======================
    // 预测配置
    // ======================

    prediction:{


        // 候选组合数量

        candidateSize:200



    },









    // ======================
    // 学习配置
    // ======================

    learning:{


        // 最大权重

        maxWeight:2.0,



        // 最小权重

        minWeight:0.5



    },









    // ======================
    // 大乐透理论参数
    // ======================

    theory:{


        front:{


            minSum:60,


            maxSum:180,



            minOdd:1,


            maxOdd:4



        },



        back:{


            minSum:3,


            maxSum:35



        }



    }



};





export default config;