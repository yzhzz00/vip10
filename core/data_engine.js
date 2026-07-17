// DLT-AI-CORE VIP
// core/data_engine.js
//
// 数据引擎
//
// 负责:
// 1.读取历史开奖
// 2.数据格式化
// 3.提供统一数据接口


import fs from "fs";

import path from "path";

import CONFIG from "../config.js";





class DataEngine {


    constructor(){


        this.history = [];


        this.loaded = false;


    }







    // ======================
    // 加载数据
    // ======================

    load(){


        const file =

        path.resolve(

            CONFIG.DATA_PATH

        );



        if(

            !fs.existsSync(file)

        ){


            throw new Error(

                "大乐透数据文件不存在"

            );


        }






        const content =

        fs.readFileSync(

            file,

            "utf-8"

        );







        this.history =

        this.parse(

            content

        );







        this.loaded = true;







        return this.history;


    }









    // ======================
    // 数据解析
    // ======================

    parse(content){



        const lines =

        content

        .split(/\r?\n/)

        .filter(

            line =>

            line.trim()

        );








        let result = [];







        for(

            let line of lines

        ){



            let nums =

            line

            .match(/\d+/g);






            if(

                !nums

                ||

                nums.length < 7

            )

                continue;








            nums =

            nums

            .map(

                n =>

                Number(n)

            );







            let front =

            nums.slice(

                nums.length-7,

                nums.length-2

            );






            let back =

            nums.slice(

                nums.length-2

            );








            result.push({



                front,



                back



            });



        }






        return result;


    }









    // ======================
    // 获取全部历史
    // ======================

    getHistory(){



        if(

            !this.loaded

        ){


            this.load();


        }






        return this.history;


    }









    // ======================
    // 获取最近多少期
    // ======================

    getRecent(count){



        return this

        .getHistory()

        .slice(

            -count

        );



    }









    // ======================
    // 数据状态
    // ======================

    status(){



        return {



            loaded:

            this.loaded,



            count:

            this.history.length



        };


    }



}





export default new DataEngine();