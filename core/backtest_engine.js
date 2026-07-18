/**
 * DLT-AI-CORE VIP
 * 历史回测引擎
 */


import PredictionEngine from "./prediction_engine.js";


class BacktestEngine {


    constructor(){


        this.results = [];


    }





    /**
     * 执行回测
     */
    async run(
        history=[],
        periods=100
    ){


        if(
            history.length <= periods
        ){

            periods =
            history.length - 1;

        }



        let total = 0;

        let frontHit = 0;

        let backHit = 0;

        let allHit = 0;



        const start =
        history.length - periods;



        const detail=[];



        for(
            let i=start;
            i<history.length;
            i++
        ){


            const trainData =
            history.slice(
                0,
                i
            );



            const target =
            history[i];



            const predictor =
            new PredictionEngine(
                {}
            );



            const prediction =
            await predictor.predict();



            const best =
            prediction
            .predictions[0];



            const front =
            this.hitCount(
                best.front,
                target.front
            );



            const back =
            this.hitCount(
                best.back,
                target.back
            );



            total++;


            if(front>0){

                frontHit++;

            }


            if(back>0){

                backHit++;

            }


            if(
                front>=2
                &&
                back>=1
            ){

                allHit++;

            }




            detail.push({

                issue:
                target.issue,


                predict:
                best,


                actual:
                target,


                frontHit:
                front,


                backHit:
                back


            });


        }





        const result={


            periods:total,


            frontAccuracy:

            Number(
                (
                frontHit/total*100
                )
                .toFixed(2)
            ),



            backAccuracy:

            Number(
                (
                backHit/total*100
                )
                .toFixed(2)
            ),



            effectiveHit:

            Number(
                (
                allHit/total*100
                )
                .toFixed(2)
            ),



            detail



        };



        this.results.push(
            result
        );



        return result;


    }





    /**
     * 命中数量
     */
    hitCount(
        predict=[],
        actual=[]
    ){


        let count=0;



        predict.forEach(
            n=>{

                if(
                    actual.includes(n)
                ){

                    count++;

                }

            }
        );



        return count;


    }





    /**
     * 历史记录
     */
    getResults(){

        return this.results;

    }



}



export default BacktestEngine;