// models/frequency.js


export class FrequencyModel {


    constructor(){

        this.name = "frequency";

        this.frontScore = {};

        this.backScore = {};

    }



    // =====================
    // 训练
    // =====================

    train(history){


        this.frontScore = {};

        this.backScore = {};



        for(let i=1;i<=35;i++){

            this.frontScore[i]=0;

        }



        for(let i=1;i<=12;i++){

            this.backScore[i]=0;

        }




        history.forEach(item=>{


            item.front.forEach(n=>{

                this.frontScore[n]++;

            });



            item.back.forEach(n=>{

                this.backScore[n]++;

            });



        });



    }





    // =====================
    // 单号码评分
    // =====================

    scoreNumber(
        n,
        type="front"
    ){


        if(type==="front"){

            return this.frontScore[n] || 0;

        }


        return this.backScore[n] || 0;


    }





    // =====================
    // 候选评分
    // =====================

    predict(candidate){


        let score=0;



        candidate.front.forEach(n=>{


            score +=
            this.scoreNumber(
                n,
                "front"
            );


        });



        candidate.back.forEach(n=>{


            score +=
            this.scoreNumber(
                n,
                "back"
            );


        });



        return {


            model:this.name,


            score:
            score



        };


    }



}