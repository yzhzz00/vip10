// DLT-AI-CORE V11 FINAL
// core/cache.js
// 缓存管理模块
// 保存预测结果、模型状态、计算结果


import fs from "fs";
import path from "path";


class Cache {


    constructor(file="./logs/cache.json"){


        this.file = file;


        this.data = {

            prediction:null,

            models:null,

            backtest:null,

            learning:null,

            updated:null

        };


        this.load();


    }





    // 初始化缓存目录

    init(){


        const dir =

        path.dirname(
            this.file
        );



        if(
            !fs.existsSync(dir)
        ){

            fs.mkdirSync(
                dir,
                {
                    recursive:true
                }
            );

        }


    }





    // 读取缓存

    load(){


        try{


            this.init();



            if(
                fs.existsSync(
                    this.file
                )
            ){


                const content =

                fs.readFileSync(
                    this.file,
                    "utf-8"
                );



                this.data =

                JSON.parse(
                    content
                );


            }



        }

        catch(error){


            console.log(
                "Cache load error:",
                error.message
            );


        }


    }





    // 保存缓存

    save(){


        try{


            this.init();



            fs.writeFileSync(

                this.file,

                JSON.stringify(
                    this.data,
                    null,
                    2
                )

            );



        }

        catch(error){


            console.log(

                "Cache save error:",

                error.message

            );


        }


    }





    // 设置缓存

    set(key,value){


        this.data[key]=value;


        this.data.updated =

        new Date();



        this.save();


    }





    // 获取缓存

    get(key){


        return (

            this.data[key]

            ||

            null

        );


    }





    // 清理缓存

    clear(){


        this.data={


            prediction:null,


            models:null,


            backtest:null,


            learning:null,


            updated:null


        };


        this.save();


    }





    // 判断是否存在

    has(key){


        return (

            this.data[key]

            !==

            null

        );


    }





}



export default Cache;