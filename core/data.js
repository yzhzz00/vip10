// DLT-AI-CORE V11 FINAL
// core/data.js
// 数据读取引擎


import fs from "fs/promises";
import path from "path";


class DataEngine {


    constructor(){


        this.file =
        "./data/dlt_history.txt";


        this.cache =
        [];


    }









    async load(){


        if(
            this.cache.length
            >
            0
        ){


            return this.cache;


        }



        const text =
        await fs.readFile(
            this.file,
            "utf-8"
        );



        this.cache =
        this.parse(
            text
        );



        return this.cache;


    }









    parse(text){


        const lines =
        text
        .split("\n")
        .filter(
            line =>
            line.trim()
            .length
            >
            0
        );



        const result =
        [];



        for(
            const line
            of lines
        ){


            const nums =
            line
            .trim()
            .split(
                /\s+/
            )
            .map(
                Number
            );



            if(
                nums.length
                <
                8
            ){


                continue;


            }



            result.push({

                period:
                String(
                    nums[0]
                ),


                front:
                nums
                .slice(
                    1,
                    6
                ),


                back:
                nums
                .slice(
                    6,
                    8
                )


            });



        }



        return result;


    }









    clearCache(){


        this.cache =
        [];


    }









    count(){


        return this.cache.length;


    }



}



export default DataEngine;