/**
 * DLT-AI-CORE VIP
 * Data Engine V2.0 FINAL
 *
 * 大乐透历史数据读取
 */


import fs from "fs";




class DataEngine {



    constructor(){


        this.file =

        "./data/dlt_history.txt";


    }









    async load(){



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

            "utf-8"

        );








        const lines =

        text

        .split(/\r?\n/)

        .filter(

            line=>

            line.trim()

        );







        const result=[];







        lines.forEach(

            line=>{



                const item =

                this.parseLine(

                    line

                );





                if(item){


                    result.push(item);


                }



            }

        );






        return result;



    }









    parseLine(

        line

    ){





        const parts =

        line

        .trim()

        .split(/\s+/);







        if(

            parts.length < 9

        ){

            return null;

        }







        const issue =

        parts[0];







        const date =

        parts[1];







        const nums =

        parts

        .slice(

            2

        )

        .map(Number)

        .filter(

            n=>

            !isNaN(n)

        );








        if(

            nums.length < 7

        ){

            return null;

        }








        return {



            issue,



            date,



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



        };



    }









    latest(

        data=[]

    ){


        return data[

            data.length-1

        ];


    }







}



export default DataEngine;