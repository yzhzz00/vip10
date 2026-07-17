// DLT-AI-CORE VIP
// core/storage.js
//
// 数据存储模块
//
// 作用:
// 保存预测结果
// 保存AI会议记录
// 保存模型状态
//
// 存储:
// storage/predictions.json
// storage/models.json
// storage/feedback.json


import fs from "fs";

import path from "path";

import CONFIG from "../config.js";





class StorageManager {



    constructor(){


        this.dir=

        CONFIG.PATH.storage;



        this.init();


    }









    // ======================
    // 初始化目录
    // ======================

    init(){



        if(

            !fs.existsSync(

                this.dir

            )

        ){



            fs.mkdirSync(

                this.dir,

                {

                    recursive:true

                }

            );


        }






        this.createFile(

            "predictions.json",

            []

        );



        this.createFile(

            "models.json",

            {}

        );



        this.createFile(

            "feedback.json",

            []

        );



    }









    createFile(

        name,

        data

    ){



        const file=

        path.join(

            this.dir,

            name

        );





        if(

            !fs.existsSync(

                file

            )

        ){



            fs.writeFileSync(

                file,

                JSON.stringify(

                    data,

                    null,

                    2

                )

            );


        }


    }









    // ======================
    // 写入文件
    // ======================

    save(

        name,

        data

    ){



        const file=

        path.join(

            this.dir,

            name

        );





        fs.writeFileSync(

            file,

            JSON.stringify(

                data,

                null,

                2

            )

        );



    }









    // ======================
    // 读取文件
    // ======================

    load(name){



        const file=

        path.join(

            this.dir,

            name

        );





        if(

            !fs.existsSync(

                file

            )

        )

            return null;







        return JSON.parse(

            fs.readFileSync(

                file,

                "utf-8"

            )

        );



    }









    // ======================
    // 保存预测
    // ======================

    savePrediction(result){



        let list=

        this.load(

            "predictions.json"

        )

        ||

        [];







        list.push({

            time:

            new Date()

            .toISOString(),



            result



        });







        this.save(

            "predictions.json",

            list

        );



    }









    // ======================
    // 保存模型状态
    // ======================

    saveModels(models){



        this.save(

            "models.json",

            models

        );


    }









    // ======================
    // 保存反馈
    // ======================

    saveFeedback(data){



        let list=

        this.load(

            "feedback.json"

        )

        ||

        [];







        list.push(data);







        this.save(

            "feedback.json",

            list

        );



    }









    // ======================
    // 状态
    // ======================

    status(){



        return {


            path:

            this.dir,



            files:[


                "predictions.json",


                "models.json",


                "feedback.json"


            ]



        };


    }



}





export default new StorageManager();