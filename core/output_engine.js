/**
 * DLT-AI-CORE VIP
 * Output Engine V2.0
 *
 * 输出格式控制
 */



class OutputEngine {



    constructor(){


        this.version =
        "DLT-AI-CORE VIP V2.0";


    }








    prediction(

        predictions=[],

        models={}

    ){



        return {


            system:

            this.version,



            type:

            "prediction",



            time:

            new Date()

            .toISOString(),




            count:

            predictions.length,





            predictions:

            predictions.map(

                (item,index)=>{


                    return {


                        rank:

                        index+1,



                        front:

                        item.front
                        .sort(

                            (a,b)=>
                            a-b

                        ),



                        back:

                        item.back
                        .sort(

                            (a,b)=>
                            a-b

                        ),




                        score:

                        Number(

                            item.score
                            ||
                            0

                        .toFixed(2)

                        ),




                        confidence:

                        this.confidence(

                            item.score

                        )



                    };


                }

            )



        };



    }









    backtest(

        data={}

    ){



        return {


            system:

            this.version,



            type:

            "backtest",



            time:

            new Date()

            .toISOString(),



            result:data



        };


    }









    montecarlo(

        data=[],

        times=1000000

    ){



        return {


            system:

            this.version,



            type:

            "montecarlo",



            simulation:

            times,



            count:

            data.length,



            top:

            data.slice(

                0,

                10

            )


        };



    }









    learning(

        result={}

    ){



        return {


            system:

            this.version,



            type:

            "learning",



            status:

            result.status
            ||
            "complete",



            totalLearning:

            result.totalLearning
            ||
            0,



            weights:

            result.weights
            ||
            {}



        };


    }









    confidence(

        score=0

    ){



        if(
            score>=5000
        ){

            return "high";


        }


        if(
            score>=3000
        ){

            return "medium";


        }


        return "normal";


    }





}





export default OutputEngine;