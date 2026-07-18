/**
 * DLT-AI-CORE VIP
 * 预测生成引擎
 */


import ScoringEngine from "./scoring_engine.js";


class PredictionEngine {


    constructor(
        modelResult={}
    ){

        this.modelResult =
        modelResult;


        this.scoring =
        new ScoringEngine();


    }





    /**
     * 主预测入口
     */
    async predict(){


        const front =
        this.generateFront();


        const back =
        this.generateBack();



        const results=[];



        for(
            let i=0;
            i<3;
            i++
        ){

            results.push({

                rank:
                i+1,


                front:
                front[i],


                back:
                back[i],


                score:
                Number(
                    (
                    Math.random()
                    *
                    100
                    )
                    .toFixed(2)
                ),


                models:
                this.modelResult

            });


        }



        return {


            time:
            new Date()
            .toISOString(),


            predictions:
            results


        };


    }





    /**
     * 前区生成
     */
    generateFront(){


        const pool=[];



        for(
            let i=1;
            i<=35;
            i++
        ){

            pool.push(i);

        }



        const result=[];



        for(
            let i=0;
            i<3;
            i++
        ){


            const arr =
            this.randomPick(
                pool,
                5
            );


            result.push(
                arr.sort(
                    (a,b)=>a-b
                )
            );


        }



        return result;


    }





    /**
     * 后区生成
     */
    generateBack(){


        const pool=[];



        for(
            let i=1;
            i<=12;
            i++
        ){

            pool.push(i);

        }



        const result=[];



        for(
            let i=0;
            i<3;
            i++
        ){


            const arr =
            this.randomPick(
                pool,
                2
            );


            result.push(
                arr.sort(
                    (a,b)=>a-b
                )
            );


        }



        return result;


    }





    /**
     * 随机选择
     */
    randomPick(
        pool,
        count
    ){


        const copy =
        [...pool];


        const result=[];



        while(
            result.length<count
        ){


            const index =
            Math.floor(
                Math.random()
                *
                copy.length
            );


            result.push(
                copy[index]
            );


            copy.splice(
                index,
                1
            );


        }



        return result;


    }



}



export default PredictionEngine;