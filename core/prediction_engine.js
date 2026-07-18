/**
 * DLT-AI-CORE VIP
 * Prediction Engine V5.1 FINAL
 *
 * 大乐透预测总控
 */


import MonteCarloEngine from "./montecarlo_engine.js";



class PredictionEngine {



    constructor(

        models,

        features

    ){



        this.models=models;


        this.features=features;


    }









    async predict(){



        const ensemble =

        this.models.ensemble;







        const monte =

        new MonteCarloEngine(

            ensemble,

            {

                times:1000000

            }

        );








        const results =

        await monte.run();








        const predictions =

        results.map(

            (item,index)=>{



                return {



                    rank:index+1,



                    front:item.front,



                    back:item.back,



                    score:item.score,



                    confidence:

                    this.confidence(

                        item.score

                    )



                };



            }

        );








        return {



            time:

            new Date()

            .toISOString(),




            status:

            "completed",




            predictions,





            models:

            this.getModelStatus()



        };



    }









    confidence(

        score

    ){



        if(

            score>=100

        )

        return "high";





        if(

            score>=70

        )

        return "medium";





        return "normal";



    }









    getModelStatus(){



        return {



            statistics:

            {

                status:

                "completed"

            },





            bayesian:

            {

                status:

                "completed"

            },





            markov:

            {

                status:

                "completed"

            },





            matrix:

            {

                status:

                "completed"

            },





            structure:

            {

                status:

                "completed"

            },





            ensemble:

            {

                status:

                "completed"

            }



        };



    }



}



export default PredictionEngine;