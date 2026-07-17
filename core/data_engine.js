// DLT-AI-CORE VIP
// core/data_engine.js
//
// 数据引擎
//
// 功能:
// 1.读取大乐透历史数据
// 2.解析号码
// 3.提供统一数据格式


import fs from "fs";

import CONFIG from "../config.js";



class DataEngine {



    constructor(){


        this.history=[];


    }






    // ======================
    // 加载数据
    // ======================

    load(){



        if(

            !fs.existsSync(

                CONFIG.DATA_PATH

            )

        ){



            throw new Error(

                "大乐透数据文件不存在"

            );


        }







        const text =

        fs.readFileSync(

            CONFIG.DATA_PATH,

            "utf-8"

        );







        this.history =

        this.parse(text);







        return this.history;


    }









    // ======================
    // 数据解析
    // ======================

    parse(text){



        let lines =

        text

        .split(/\r?\n/)

        .filter(

            line=>

            line.trim()

        );







        let result=[];








        lines.forEach(line=>{



            let nums =

            line

            .trim()

            .split(/\s+/)

            .map(Number)

            .filter(

                n=>

                !isNaN(n)

            );







            // 大乐透格式

            // 前区5 + 后区2

            if(

                nums.length>=7

            ){



                result.push({



                    front:

                    nums.slice(

                        0,

                        5

                    ),



                    back:

                    nums.slice(

                        5,

                        7

                    )



                });



            }



        });







        return result;


    }









    // ======================
    // 获取历史
    // ======================

    getHistory(){



        if(

            this.history.length===0

        ){



            this.load();



        }







        return this.history;


    }









    // ======================
    // 数据状态
    // ======================

    status(){



        return {



            loaded:

            this.history.length>0,



            count:

            this.history.length,



            path:

            CONFIG.DATA_PATH



        };



    }







}



export default new DataEngine();