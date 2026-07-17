// DLT-AI-CORE VIP
// core/data.js
// 大乐透历史数据读取解析模块
// 支持格式:
//
// 07001 2007-05-30 22 24 29 31 35 04 11


import fs from "fs";
import config from "../config.js";
import Validator from "./validator.js";



class DataManager {



    constructor(){


        this.file =

        config.data.historyFile;



        this.validator =

        new Validator();



        this.history=[];



    }







    // ======================
    // 加载历史数据
    // ======================

    load(){



        if(

            this.history.length>0

        ){


            return this.history;


        }





        if(

            !fs.existsSync(

                this.file

            )

        ){


            throw new Error(

                "历史数据文件不存在"

            );


        }







        const text =

        fs.readFileSync(

            this.file,

            "utf8"

        );






        const lines =

        text

        .split(/\r?\n/)

        .filter(

            line=>

            line.trim()

        );







        this.history=[];






        for(

            let line of lines

        ){



            const draw =

            this.parseLine(

                line

            );





            if(draw){


                this.history.push(

                    draw

                );


            }



        }







        if(

            !this.validator.checkHistory(

                this.history

            )

        ){



            throw new Error(

                this.validator

                .getErrors()

                .join(",")

            );


        }







        return this.history;



    }









    // ======================
    // 单行解析
    // ======================

    parseLine(line){



        const arr =

        line

        .trim()

        .split(/\s+/);







        if(

            arr.length < 8

        ){



            return null;


        }








        const issue =

        arr[0];



        const date =

        arr[1];








        const numbers =

        arr

        .slice(2)

        .map(

            n=>

            Number(n)

        );








        const front =

        numbers

        .slice(

            0,

            5

        );






        const back =

        numbers

        .slice(

            5,

            7

        );









        if(

            front.length!==5

            ||

            back.length!==2

        ){



            return null;



        }









        return {


            issue,


            date,


            front,


            back



        };



    }









    // ======================
    // 获取最近多少期
    // ======================

    recent(count){



        if(

            this.history.length===0

        ){



            this.load();



        }





        return this.history.slice(

            -count

        );



    }









    // ======================
    // 数据数量
    // ======================

    size(){



        return this.history.length;



    }



}



export default DataManager;