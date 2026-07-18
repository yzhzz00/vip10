/**
 * DLT-AI-CORE VIP
 * 数据读取引擎
 *
 * 大乐透历史数据解析
 */


import fs from "fs";
import {
    sortNumbers
} from "../utils/helper.js";



class DataEngine {


    constructor(
        filePath
    ){

        this.filePath =
        filePath;

    }



    /**
     * 加载历史数据
     */
    load(){


        if(
            !fs.existsSync(
                this.filePath
            )
        ){

            console.log(
                "历史数据文件不存在:",
                this.filePath
            );


            return [];

        }



        const text =
        fs.readFileSync(
            this.filePath,
            "utf8"
        );



        const lines =
        text
        .split(/\r?\n/)
        .filter(
            line =>
            line.trim()
        );



        const history=[];



        lines.forEach(
            line=>{


                const item =
                this.parseLine(
                    line
                );


                if(item){

                    history.push(
                        item
                    );

                }


            }
        );



        return history;


    }




    /**
     * 单行解析
     *
     * 格式:
     * 07001 2007-05-30
     * 22 24 29 31 35
     * 04 11
     */
    parseLine(
        line
    ){


        try{


            const parts =
            line
            .trim()
            .split(/\s+/);



            /*
             * 至少:
             *
             * 期号
             * 日期
             * 前区5个
             * 后区2个
             *
             * 共9项
             */

            if(
                parts.length < 9
            ){

                return null;

            }




            const issue =
            parts[0];



            const date =
            parts[1];



            const front =
            parts
            .slice(2,7)
            .map(
                Number
            );



            const back =
            parts
            .slice(7,9)
            .map(
                Number
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


                front:
                sortNumbers(
                    front
                ),



                back:
                sortNumbers(
                    back
                )

            };



        }catch(error){


            return null;


        }


    }





    /**
     * 获取前区数组
     */
    getFrontHistory(
        history=[]
    ){

        return history.map(
            item =>
            item.front
        );

    }



    /**
     * 获取后区数组
     */
    getBackHistory(
        history=[]
    ){

        return history.map(
            item =>
            item.back
        );

    }



    /**
     * 数据检查
     */
    validate(
        history=[]
    ){


        return {

            count:
            history.length,


            valid:
            history.every(
                item=>
                item.front.length===5
                &&
                item.back.length===2
            )


        };


    }



}


export default DataEngine;