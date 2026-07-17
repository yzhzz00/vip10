// DLT-AI-CORE VIP
// core/data_engine.js
//
// 数据读取引擎 V3.0
//
// 功能:
// 1.读取历史大乐透数据
// 2.格式清洗
// 3.异常过滤
// 4.统一输出


import fs from "fs";

import path from "path";



class DataEngine {


    constructor(){


        this.history=[];


        this.statusInfo={

            loaded:false,

            count:0

        };


    }









    load(filePath){



        try{



            let absolute=

            path.resolve(

                filePath

            );







            if(

                !fs.existsSync(

                    absolute

                )

            ){



                throw new Error(

                    "数据文件不存在: "

                    +

                    absolute

                );


            }







            let text=

            fs.readFileSync(

                absolute,

                "utf-8"

            );







            this.history=

            this.parse(

                text

            );







            this.statusInfo={



                loaded:true,



                count:this.history.length



            };







            return this.history;


        }

        catch(error){



            console.log(

                "数据读取失败:",

                error.message

            );







            this.history=[];







            return [];


        }


    }









    parse(text){



        let result=[];







        let lines=

        text.split(

            /\r?\n/

        );







        lines.forEach(line=>{



            line=line.trim();







            if(

                !line

            )

            return;







            let nums=

            line.match(

                /\d+/g

            );







            if(

                !nums

                ||

                nums.length<7

            )

            return;








            let arr=

            nums.map(

                Number

            );








            let front=

            arr.slice(

                0,

                5

            );







            let back=

            arr.slice(

                5,

                7

            );








            // 大乐透范围校验

            let validFront=

            front.every(

                n=>

                n>=1

                &&

                n<=35

            );







            let validBack=

            back.every(

                n=>

                n>=1

                &&

                n<=12

            );







            if(

                !validFront

                ||

                !validBack

            )

            return;








            result.push({



                front,



                back



            });



        });








        return result;


    }









    getHistory(){



        return this.history;


    }









    status(){



        return this.statusInfo;


    }



}





export default new DataEngine();