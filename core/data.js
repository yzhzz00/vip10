// DLT-AI-CORE V11 FINAL
// core/data.js
// 历史数据读取与验证模块


import fs from "fs";
import config from "../config.js";



class DataManager {


    constructor(){

        this.history = [];

        this.historyCount = 0;

    }



    load(){

        const file = config.data.file;


        if(!fs.existsSync(file)){

            throw new Error(
                "历史数据文件不存在: " + file
            );

        }



        const content =

        fs.readFileSync(
            file,
            "utf-8"
        );



        const lines =

        content
        .split(/\r?\n/)
        .map(v=>v.trim())
        .filter(v=>v);



        const result = [];



        for(const line of lines){


            const nums =

            line.match(/\d+/g);



            if(!nums || nums.length < 7){

                continue;

            }



            const values =

            nums
            .map(Number);



            const front =

            values
            .slice(0,5)
            .filter(
                n=>n>=1 && n<=35
            );



            const back =

            values
            .slice(-2)
            .filter(
                n=>n>=1 && n<=12
            );



            if(
                front.length===5 &&
                back.length===2
            ){


                result.push({

                    front,

                    back,

                    raw:line

                });


            }


        }



        if(
            result.length <
            config.data.minHistory
        ){

            throw new Error(

                "有效历史数据不足: "
                +
                result.length

            );

        }



        this.history = result;


        this.historyCount =

        result.length;



        console.log(

            "History loaded:",
            this.historyCount

        );


        return this.history;


    }





    getHistory(){


        return this.history;


    }




    latest(){


        if(
            this.history.length===0
        ){

            return null;

        }


        return this.history[
            this.history.length-1
        ];


    }





    statistics(){


        const frontCount = {};

        const backCount = {};



        for(const item of this.history){


            for(const n of item.front){


                frontCount[n] =
                (frontCount[n]||0)+1;


            }



            for(const n of item.back){


                backCount[n] =
                (backCount[n]||0)+1;


            }


        }



        return {


            frontCount,

            backCount,

            total:

            this.history.length


        };


    }



}



export default DataManager;