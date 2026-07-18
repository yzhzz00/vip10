// models/trend_ai.js


export class TrendAIModel {


    constructor(){


        this.name =
        "trend_ai";


        this.window =
        50;


        this.trend={};


        this.omission={};


    }





    // =====================
    // 训练
    // =====================

    train(history){


        this.trend={};


        this.omission={};



        let data =

        history.slice(
            -this.window
        );





        for(
            let i=1;
            i<=35;
            i++
        ){


            this.trend[i]=0;

            this.omission[i]=0;


        }





        // 近期趋势

        data.forEach(
        (item,index)=>{


            let weight =
            index+1;



            item.front.forEach(n=>{


                this.trend[n]
                +=
                weight;



            });



        });





        // 当前遗漏

        for(
            let n=1;
            n<=35;
            n++
        ){


            let miss=0;



            for(
                let i=
                history.length-1;

                i>=0;

                i--
            ){


                if(

                    history[i]
                    .front
                    .includes(n)

                ){

                    break;

                }



                miss++;


            }



            this.omission[n]=miss;



        }



    }





    // =====================
    // 趋势评分
    // =====================

    trendScore(
        n
    ){


        return (

            this.trend[n]
            ||
            0

        );

    }





    // =====================
    // 遗漏恢复评分
    // =====================

    omissionScore(
        n
    ){


        let miss =
        this.omission[n]
        ||
        0;



        if(
            miss>=10
        ){

            return 5;

        }



        if(
            miss>=5
        ){

            return 2;

        }



        return 0;


    }





    // =====================
    // 候选评分
    // =====================

    predict(candidate){


        let score=0;



        candidate.front.forEach(n=>{


            score +=

            this.trendScore(
                n
            );


            score +=

            this.omissionScore(
                n
            );



        });





        return {


            model:
            this.name,


            score



        };



    }



}