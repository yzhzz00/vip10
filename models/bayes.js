// models/bayes.js


export class BayesModel {


    constructor(){


        this.name =
        "bayes";


        this.frontProb={};


        this.backProb={};


        this.total=0;


    }





    // =====================
    // 训练
    // =====================

    train(history){


        this.frontProb={};


        this.backProb={};


        this.total =
        history.length;



        for(
            let i=1;
            i<=35;
            i++
        ){


            this.frontProb[i]=1;


        }



        for(
            let i=1;
            i<=12;
            i++
        ){


            this.backProb[i]=1;


        }





        history.forEach(item=>{


            item.front.forEach(n=>{


                this.frontProb[n]++;


            });



            item.back.forEach(n=>{


                this.backProb[n]++;


            });



        });



    }





    // =====================
    // 概率计算
    // =====================

    probability(
        n,
        type
    ){


        if(type==="front"){


            return (

                this.frontProb[n]
                /
                (
                    this.total*5+35
                )

            );


        }



        return (

            this.backProb[n]
            /
            (
                this.total*2+12
            )

        );


    }





    // =====================
    // 候选评分
    // =====================

    predict(candidate){


        let score=0;



        candidate.front.forEach(n=>{


            score +=

            this.probability(
                n,
                "front"
            );


        });




        candidate.back.forEach(n=>{


            score +=

            this.probability(
                n,
                "back"
            );


        });





        return {


            model:
            this.name,


            score:
            score*1000



        };


    }



}