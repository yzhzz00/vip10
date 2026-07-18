/**
 * DLT-AI-CORE VIP
 * Backtest Engine V3.0
 *
 * 滚动训练回测
 */


import ModelEngine
from "./model_engine.js";


import PredictionEngine
from "./prediction_engine.js";





class BacktestEngine {



    constructor(){


        this.logs=[];


    }








    async run(

        history=[],

        periods=100

    ){



        if(
            history.length <= periods
        ){


            return {


                error:
                "历史数据不足"



            };


        }







        let total=0;


        let frontHits=0;


        let backHits=0;


        let fiveHit=0;


        let sevenHit=0;







        const start =

        history.length
        -
        periods;






        for(

            let i=start;

            i<history.length;

            i++

        ){






            const trainHistory =

            history.slice(

                0,

                i

            );






            const real =

            history[i];







            /*
             * 每一期重新训练
             */


            const modelEngine =

            new ModelEngine();





            const models =

            await modelEngine.train(

                trainHistory,

                {}

            );







            const predictor =

            new PredictionEngine(

                models

            );







            const prediction =

            await predictor.predict();







            const best =

            prediction
            .predictions[0];






            if(
                !best
            ){

                continue;

            }






            total++;







            const fhit =

            this.hitCount(

                best.front,

                real.front

            );






            const bhit =

            this.hitCount(

                best.back,

                real.back

            );







            frontHits += fhit;


            backHits += bhit;






            if(
                fhit>=5
            ){

                fiveHit++;

            }






            if(
                fhit>=5
                &&
                bhit>=2
            ){

                sevenHit++;

            }







            this.logs.push({


                issue:
                real.issue,


                predict:
                best,


                result:
                real,


                frontHit:
                fhit,


                backHit:
                bhit



            });





        }








        return {



            periods,


            samples:
            total,



            frontHits,


            backHits,



            fiveHit,


            sevenHit,



            frontAccuracy:

            this.rate(

                frontHits,

                total*5

            ),



            backAccuracy:

            this.rate(

                backHits,

                total*2

            ),



            detail:

            this.logs.slice(
                -10
            )



        };



    }









    hitCount(

        predict=[],

        real=[]

    ){



        let count=0;



        predict.forEach(

            n=>{


                if(
                    real.includes(n)
                ){

                    count++;

                }


            }

        );



        return count;


    }








    rate(

        hit,

        total

    ){


        if(
            total===0
        ){

            return 0;

        }



        return Number(

            (

            hit
            /
            total
            *
            100

            )

            .toFixed(2)

        );


    }




}





export default BacktestEngine;