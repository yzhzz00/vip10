// DLT-AI-CORE VIP
// core/storage_engine.js
//
// 存储引擎升级版
//
// 功能:
// 1.预测保存
// 2.反馈保存
// 3.模型状态保存
// 4.回测保存


import fs from "fs";

import path from "path";

import CONFIG from "../config.js";




class StorageEngine {



    constructor(){


        this.path=

        CONFIG.STORAGE_PATH;


        this.init();



    }









    // ======================
    // 初始化目录
    // ======================

    init(){



        if(

            !fs.existsSync(

                this.path

            )

        ){



            fs.mkdirSync(

                this.path,

                {

                    recursive:true

                }

            );



        }



    }









    // ======================
    // 写入文件
    // ======================

    write(

        file,

        data

    ){



        let target=

        path.join(

            this.path,

            file

        );







        fs.writeFileSync(

            target,

            JSON.stringify(

                data,

                null,

                2

            ),

            "utf-8"

        );







        return true;


    }









    // ======================
    // 读取文件
    // ======================

    read(file){



        let target=

        path.join(

            this.path,

            file

        );







        if(

            !fs.existsSync(

                target

            )

        ){



            return null;



        }







        return JSON.parse(

            fs.readFileSync(

                target,

                "utf-8"

            )

        );


    }









    // ======================
    // 保存预测
    // ======================

    savePrediction(data){



        return this.write(

            "predictions.json",

            data

        );


    }









    // ======================
    // 保存反馈
    // ======================

    saveFeedback(data){



        return this.write(

            "feedback.json",

            data

        );


    }









    // ======================
    // 保存模型状态
    // ======================

    saveModels(data){



        return this.write(

            "models.json",

            data

        );


    }









    // ======================
    // 保存回测
    // ======================

    saveBacktest(data){



        return this.write(

            "backtest.json",

            data

        );


    }









    // ======================
    // 获取全部状态
    // ======================

    status(){



        return {



            prediction:

            this.read(

                "predictions.json"

            ),



            feedback:

            this.read(

                "feedback.json"

            ),



            models:

            this.read(

                "models.json"

            ),



            backtest:

            this.read(

                "backtest.json"

            )



        };


    }



}





export default new StorageEngine();