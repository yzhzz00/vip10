// DLT-AI-CORE VIP
// config.js
//
// 系统配置


import path from "path";

import { fileURLToPath } from "url";



const __filename = fileURLToPath(import.meta.url);


const __dirname = path.dirname(__filename);





const CONFIG = {


    // 项目根目录

    ROOT_PATH:

    __dirname,




    // 数据文件

    DATA_PATH:

    path.join(

        __dirname,

        "data",

        "dlt_history.txt"

    ),




    // 存储目录

    STORAGE_PATH:

    path.join(

        __dirname,

        "storage"

    ),




    // 日志目录

    LOG_PATH:

    path.join(

        __dirname,

        "logs"

    ),




    // 模拟次数

    MONTE_CARLO_TIMES:

    100000,




    // 默认预测数量

    PREDICT_COUNT:

    10,




    // 回测起始期

    BACKTEST_START:

    100,




    // 大乐透规则

    LOTTERY_RULE:{


        FRONT_MAX:35,


        FRONT_PICK:5,


        BACK_MAX:12,


        BACK_PICK:2



    }



};





export default CONFIG;