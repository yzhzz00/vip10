/**
 * DLT-AI-CORE VIP
 * Output Engine V3.0 FINAL
 *
 * 输出格式整理
 */


class OutputEngine {



    constructor(){


        this.version =

        "V3.0 FINAL";


    }









    prediction(

        predictions=[],

        models={}

    ){



        return {



            system:

            "DLT-AI-CORE VIP",



            version:

            this.version,



            time:

            new Date()

            .toISOString(),






            predictions,






            meeting:

            this.buildMeeting(

                models

            )



        };



    }









    buildMeeting(

        models={}

    ){



        const result=[];







        const names=[


            "statistics",


            "bayesian",


            "markov",


            "matrix",


            "structure",


            "ensemble"



        ];








        names.forEach(

            name=>{



                const model =

                models[name];






                if(

                    model

                ){



                    result.push({



                        model:name,



                        status:

                        "completed",




                        topNumbers:

                        model.numbers

                        ?

                        model.numbers

                        .slice(

                            0,

                            5

                        )

                        :

                        []



                    });



                }



            }

        );







        return result;



    }









    backtest(

        result

    ){



        return {



            type:

            "history_backtest",



            data:

            result,



            status:

            "completed"



        };



    }









    learning(

        result

    ){



        return {



            type:

            "ai_learning",



            learned:

            result.total,



            weights:

            result.weights,



            status:

            result.status



        };



    }





}



export default OutputEngine;