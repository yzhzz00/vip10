// ==================================================
// 大乐透 AI V100 CORE FINAL
// learning.js
// AI长期学习权重管理
// ==================================================

"use strict";


window.V100Learning = {



    model:{


        trainCount:0,


        hitCount:0,


        missCount:0,


        weights:{


            trend:1,


            structure:1,


            probability:1,


            markov:1,


            back:1


        },


        history:[]


    },







    // ==========================
    // 初始化模型
    // ==========================


    init(){



        let save =

        localStorage.getItem(
            "V100_AI_MODEL"
        );



        if(save){


            this.model =
            JSON.parse(save);


        }




    },









    // ==========================
    // 学习一次结果
    // ==========================


    learn(record){



        this.model.trainCount++;





        let hit =
        record.result.total;






        if(hit>=3){


            this.model.hitCount++;





            // 命中后增强有效模块


            this.model.weights.trend
            +=0.02;



            this.model.weights.structure
            +=0.02;



        }

        else{


            this.model.missCount++;




            // 未命中降低随机因素


            this.model.weights.probability
            +=0.01;



        }






        // 后区单独学习


        if(
            record.result.back>=1
        ){


            this.model.weights.back
            +=0.015;


        }








        this.model.history.push({


            time:
            Date.now(),


            hit,


            weights:
            this.model.weights



        });








        // 防止无限增长


        if(
            this.model.history.length>500
        ){


            this.model.history.shift();


        }






        this.save();



    },









    // ==========================
    // 获取权重
    // ==========================


    getWeights(){


        return this.model.weights;


    },








    // ==========================
    // 保存模型
    // ==========================


    save(){


        localStorage.setItem(

            "V100_AI_MODEL",

            JSON.stringify(
                this.model
            )

        );



    },









    // ==========================
    // 重置模型
    // ==========================


    reset(){



        localStorage.removeItem(

            "V100_AI_MODEL"

        );



        this.init();



    },








    // ==========================
    // 模型报告
    // ==========================


    report(){



        return {



            training:

            this.model.trainCount,



            hit:

            this.model.hitCount,



            miss:

            this.model.missCount,



            accuracy:


            this.model.trainCount===0

            ?

            0

            :

            (

            this.model.hitCount

            /

            this.model.trainCount

            *

            100

            )
            .toFixed(2)



            +

            "%",




            weights:

            this.model.weights



        };



    }





};






document.addEventListener(

"DOMContentLoaded",

()=>{


    V100Learning.init();


});