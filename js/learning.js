// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// learning.js
// AI权重学习系统
// ==================================================

"use strict";


window.V100Learning = {


    key:
    "V100_MODEL_WEIGHTS",



    weights:{


        trend:1.00,


        structure:1.00,


        probability:1.00,


        markov:1.00,


        montecarlo:1.00,


        back:1.00


    },






    // ==========================
    // 初始化
    // ==========================


    init(){


        let save =

        localStorage.getItem(

            this.key

        );



        if(save){


            this.weights=

            JSON.parse(save);


        }



    },









    // ==========================
    // 学习入口
    // ==========================


    learn(data){



        if(
            !data
            ||
            !data.result
        ){

            return;

        }






        let result=

        data.result;





        let reward=0;





        if(

            result.front>=3

        ){


            reward=0.05;


        }

        else if(

            result.front>=2

        ){


            reward=0.02;


        }

        else{


            reward=-0.01;


        }






        this.adjust(

            "probability",

            reward

        );



        this.adjust(

            "structure",

            reward

        );



        this.adjust(

            "markov",

            reward

        );






        this.save();




        console.log(

            "AI学习完成",

            this.weights

        );



    },









    // ==========================
    // 权重调整
    // ==========================


    adjust(

        name,

        value

    ){



        if(

            this.weights[name]

            ===undefined

        ){

            return;

        }






        this.weights[name]

        += value;







        // 防止无限增加


        if(

            this.weights[name]

            <0.5

        ){


            this.weights[name]=0.5;


        }





        if(

            this.weights[name]

            >2

        ){


            this.weights[name]=2;


        }




    },









    // ==========================
    // 保存
    // ==========================


    save(){


        localStorage.setItem(

            this.key,

            JSON.stringify(

                this.weights

            )

        );


    },









    // ==========================
    // 提供权重
    // ==========================


    getWeights(){


        return this.weights;


    }







};