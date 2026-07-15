// ==================================================
// 大乐透 AI V100 CORE FINAL
// bayes.js
// 贝叶斯后验概率修正
// ==================================================

"use strict";


window.V100Bayes = {



    // 当前模型权重

    weights:{


        trend:1,


        probability:1,


        structure:1,


        markov:1



    },





    // =================================
    // 初始化
    // =================================


    init(){


        let data =

        localStorage.getItem(
            "V100_BAYES_WEIGHT"
        );



        if(data){


            this.weights =
            JSON.parse(data);


        }


    },







    // =================================
    // 后验评分
    // =================================


    posterior(
        item,
        history
    ){



        let score=0;




        // 走势权重


        score +=

        item.trendScore *

        this.weights.trend;





        // 概率权重


        score +=

        item.probabilityScore *

        this.weights.probability;







        // 结构权重


        score +=

        item.structureScore *

        this.weights.structure;






        return Number(

            score.toFixed(3)

        );


    },









    // =================================
    // 根据考试结果调整
    // =================================


    learn(record){



        let hit =

        record.result.total;



        if(hit>=4){



            this.weights.trend +=0.05;


            this.weights.structure +=0.03;



        }



        else if(hit<=1){



            this.weights.probability +=0.03;


            this.weights.trend -=0.01;



        }




        this.save();



    },









    // =================================
    // 保存权重
    // =================================


    save(){


        localStorage.setItem(


            "V100_BAYES_WEIGHT",


            JSON.stringify(
                this.weights
            )


        );


    },









    // =================================
    // 获取当前状态
    // =================================


    report(){



        return {


            trend:

            this.weights.trend,



            probability:

            this.weights.probability,



            structure:

            this.weights.structure



        };


    }





};




document.addEventListener(

"DOMContentLoaded",

()=>{


    V100Bayes.init();


});