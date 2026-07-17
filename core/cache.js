// DLT-AI-CORE VIP
// core/cache.js
// 分析缓存模块
//
// 目的：
// 1. 防止重复计算导致手机卡死
// 2. 保存最近分析结果
// 3. 提高网页响应速度


import fs from "fs";
import config from "../config.js";



class Cache {



    constructor(){


        this.file =

        config.storage.cacheFile;



        this.data={};



        this.load();



    }









    // ======================
    // 读取缓存
    // ======================

    load(){



        if(

            fs.existsSync(

                this.file

            )

        ){



            try{



                this.data =

                JSON.parse(

                    fs.readFileSync(

                        this.file,

                        "utf8"

                    )

                );



            }

            catch(e){



                this.data={};



            }



        }



    }









    // ======================
    // 获取缓存
    // ======================

    get(key){



        return this.data[key]

        ||

        null;



    }









    // ======================
    // 写入缓存
    // ======================

    set(key,value){



        this.data[key]= {



            time:

            Date.now(),



            value



        };






        this.save();



    }









    // ======================
    // 检查是否有效
    // ======================

    has(key,expire=3600000){



        if(

            !this.data[key]

        ){



            return false;



        }







        const age =

        Date.now()

        -

        this.data[key].time;







        return age < expire;



    }









    // ======================
    // 保存
    // ======================

    save(){



        fs.writeFileSync(

            this.file,

            JSON.stringify(

                this.data,

                null,

                2

            )

        );



    }









    // ======================
    // 清理缓存
    // ======================

    clear(){



        this.data={};



        this.save();



    }





}



export default Cache;