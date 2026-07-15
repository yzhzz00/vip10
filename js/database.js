// ==================================================
// 大乐透 AI V100 CORE FINAL
// database.js
// 历史开奖数据中心
// ==================================================

"use strict";


window.V100Database = {



    key:"DLT_HISTORY",



    data:[],







    // ==========================
    // 初始化
    // ==========================


    init(){



        let save =

        localStorage.getItem(
            this.key
        );




        if(save){


            this.data =
            JSON.parse(save);


        }



    },









    // ==========================
    // 导入历史数据
    // ==========================


    import(data){



        /*
        
        数据格式：

        [
          {
            front:[1,5,12,22,33],
            back:[3,8]
          }
        ]

        */



        this.data =

        data.map(item=>{



            return {



                front:

                item.front
                .map(Number)
                .sort(
                    (a,b)=>a-b
                ),




                back:

                item.back
                .map(Number)
                .sort(
                    (a,b)=>a-b
                ),



                time:

                item.time
                ||
                Date.now()



            };



        });





        this.save();




        return this.data.length;



    },









    // ==========================
    // 获取全部数据
    // ==========================


    get(){


        return this.data;



    },









    // ==========================
    // 获取最近N期
    // ==========================


    recent(count){



        return this.data.slice(
            -count
        );



    },









    // ==========================
    // 获取训练窗口
    // ==========================


    getWindow(
        index,
        size=500
    ){



        return this.data.slice(

            index-size,

            index

        );



    },









    // ==========================
    // 获取训练总次数
    // ==========================


    trainingCount(
        size=500
    ){


        return Math.max(

            0,

            this.data.length-size

        );


    },









    // ==========================
    // 添加开奖
    // ==========================


    add(draw){



        this.data.push({


            front:

            draw.front
            .map(Number)
            .sort(
                (a,b)=>a-b
            ),



            back:

            draw.back
            .map(Number)
            .sort(
                (a,b)=>a-b
            ),



            time:

            Date.now()



        });




        this.save();



    },









    // ==========================
    // 删除数据
    // ==========================


    clear(){



        this.data=[];



        localStorage.removeItem(
            this.key
        );


    },









    // ==========================
    // 保存
    // ==========================


    save(){


        localStorage.setItem(

            this.key,

            JSON.stringify(
                this.data
            )

        );


    },









    // ==========================
    // 数据报告
    // ==========================


    report(){



        return {


            total:

            this.data.length,



            training:

            this.trainingCount(),



            last:

            this.data[
                this.data.length-1
            ]



        };


    }






};







document.addEventListener(

"DOMContentLoaded",

()=>{


    V100Database.init();


});