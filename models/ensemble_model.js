/**
 * DLT-AI-CORE VIP
 * Ensemble Model V2.0
 *
 * 多模型融合
 */



class EnsembleModel {



    constructor(){


        this.name =
        "ensemble";



        this.weights={


            statistics:
            0.25,


            bayesian:
            0.20,


            markov:
            0.15,


            matrix:
            0.15,


            structure:
            0.15,


            trend:
            0.10


        };


    }








    train(

        models={}

    ){



        const scoreMap={};






        /*
         * 初始化号码
         */


        for(

            let i=1;

            i<=35;

            i++

        ){


            scoreMap[i]=0;


        }







        Object.keys(

            this.weights

        )

        .forEach(

            modelName=>{



                const model =

                models[modelName];





                if(

                    !model

                    ||

                    !model.numbers

                ){

                    return;

                }







                const weight =

                this.weights[modelName];








                model.numbers

                .forEach(

                    item=>{



                        scoreMap[item.number]

                        +=

                        (

                            Number(

                                item.score

                            )

                            ||

                            0

                        )

                        *

                        weight;



                    }

                );



            }

        );







        const numbers=[];







        Object.keys(

            scoreMap

        )

        .forEach(

            n=>{



                numbers.push({



                    number:

                    Number(n),



                    score:

                    Number(

                        scoreMap[n]

                        .toFixed(5)

                    )



                });



            }

        );







        return {



            name:this.name,



            weights:this.weights,



            numbers:

            numbers.sort(

                (a,b)=>

                b.score-a.score

            )



        };



    }









    predict(

        models={}

    ){



        return this.train(

            models

        );



    }








    updateWeight(

        result={}

    ){



        /*
         * 后续开奖反馈学习接口
         */



        return this.weights;



    }





}



export default EnsembleModel;