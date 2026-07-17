// DLT-AI-CORE VIP
// core/data.js
//
// 历史数据读取模块
//
// 作用:
// 读取 data/dlt_history.txt
// 转换成模型统一格式
//
// 数据格式要求:
//
// 每行:
//
// 01 07 18 26 32 + 02 09
//
// 或:
//
// 01,07,18,26,32+02,09


import fs from "fs";

import path from "path";

import CONFIG from "../config.js";





class DataManager {



    constructor(){


        this.history=[];


        this.file=

        path.join(

            CONFIG.PATH.data,

            "dlt_history.txt"

        );


    }









    // ======================
    // 加载历史数据
    // ======================

    loadHistory(){



        if(

            !fs.existsSync(

                this.file

            )

        ){


            throw new Error(

                "历史数据文件不存在: "

                +

                this.file

            );


        }






        const text=

        fs.readFileSync(

            this.file,

            "utf-8"

        );






        this.history=

        this.parse(

            text

        );





        return this.history;


    }









    // ======================
    // 数据解析
    // ======================

    parse(text){



        const lines=

        text

        .split(/\r?\n/)

        .filter(

            x=>

            x.trim()

        );







        let result=[];






        lines.forEach(

            (line,index)=>{



                try{



                    const item=

                    this.parseLine(

                        line

                    );





                    if(item){



                        item.index=index+1;



                        result.push(

                            item

                        );


                    }





                }

                catch(e){



                    console.log(

                        "跳过错误数据:",

                        line

                    );


                }



            }

        );








        return result;


    }









    // ======================
    // 单行解析
    // ======================

    parseLine(line){



        let clean=

        line

        .replace(

            /,/g,

            " "

        )

        .replace(

            /\s+/g,

            " "

        )

        .trim();






        let parts=

        clean.split(

            "+"

        );







        if(

            parts.length!==2

        ){



            return null;


        }







        let front=

        parts[0]

        .trim()

        .split(" ")

        .map(Number)

        .filter(

            n=>

            n>=1

            &&

            n<=35

        );







        let back=

        parts[1]

        .trim()

        .split(" ")

        .map(Number)

        .filter(

            n=>

            n>=1

            &&

            n<=12

        );







        if(

            front.length!==5

            ||

            back.length!==2

        ){



            return null;


        }







        return {


            issue:

            "",



            front:

            front.sort(

                (a,b)=>a-b

            ),



            back:

            back.sort(

                (a,b)=>a-b

            )



        };


    }









    // ======================
    // 获取数据
    // ======================

    getHistory(){


        if(

            this.history.length===0

        ){


            this.loadHistory();


        }




        return this.history;


    }









    // ======================
    // 数据状态
    // ======================

    status(){



        return {


            file:

            this.file,



            count:

            this.history.length



        };


    }





}



export default new DataManager();