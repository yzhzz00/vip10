// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// database.js
// 历史数据库管理
// ==================================================

"use strict";


window.V100Database = {



    key:

    "V100_DLT_DATABASE",






    // ==========================
    // 初始化数据库
    // ==========================


    init(){


        let data =

        localStorage.getItem(

            this.key

        );



        if(!data){


            localStorage.setItem(

                this.key,

                JSON.stringify([])

            );


        }



    },









    // ==========================
    // 获取全部数据
    // ==========================


    get(){


        let data=

        localStorage.getItem(

            this.key

        );



        if(!data){

            return [];

        }




        return JSON.parse(data);



    },









    // ==========================
    // 保存数据
    // ==========================


    save(data){


        localStorage.setItem(

            this.key,

            JSON.stringify(data)

        );


    },









    // ==========================
    // 导入TXT解析结果
    // ==========================


    importData(list){



        if(

            !Array.isArray(list)

        ){

            return false;

        }





        this.save(list);



        return true;



    },









    // ==========================
    // 添加开奖
    // ==========================


    add(item){



        let data=

        this.get();





        data.push(item);





        this.save(data);



    },









    // ==========================
    // 数据统计
    // ==========================


    report(){



        let data=

        this.get();





        return {


            total:

            data.length,



            first:

            data[0],



            last:

            data[
                data.length-1
            ]



        };



    }






};