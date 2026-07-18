/**
 * DLT-AI-CORE VIP
 * Ensemble Model V5.0 FINAL
 *
 * 多模型融合核心
 */


class EnsembleModel {


    constructor(){


        this.name =

        "ensemble";


        this.weights = {


            statistics:0.25,


            bayesian:0.20,


            markov:0.20,


            matrix:0.15,


            structure:0.20



        };


    }








    train(

        models={}

    ){



        const scoreMap={};






        for(

            let n=1;

            n<=35;

            n++

        ){


            scoreMap[n]=0;


        }








        this.merge(

            scoreMap,

            models.statistics,

            this.weights.statistics

        );





        this.merge(

            scoreMap,

            models.bayesian,

            this.weights.bayesian

        );





        this.merge(

            scoreMap,

            models.markov,

            this.weights.markov

        );





        this.merge(

            scoreMap,

            models.matrix,

            this.weights.matrix

        );





        this.merge(

            scoreMap,

            models.structure,

            this.weights.structure

        );









        const numbers =

        Object.keys(

            scoreMap

        )

        .map(

            n=>({



                number:

                Number(n),



                score:

                Number(

                    scoreMap[n]

                    .toFixed(4)

                )



            })

        )

        .sort(

            (a,b)=>

            b.score-a.score

        );







        return {



            name:

            this.name,



            weights:

            this.weights,



            numbers,



            top:

            numbers.slice(

                0,

                15

            )



        };



    }









    merge(

        target,

        model,

        weight

    ){



        if(

            !model

            ||

            !model.numbers

        ){

            return;

        }








        model.numbers.forEach(

            item=>{



                if(

                    target[item.number]

                    !==undefined

                ){



                    target[item.number]

                    +=

                    item.score

                    *

                    weight;



                }



            }

        );



    }









    updateWeights(

        feedback

    ){



        /*
        后续接入学习系统
        */


        if(

            feedback>0

        ){



            this.weights.ensemble +=0.01;



        }



        return this.weights;



    }



}



export default EnsembleModel;