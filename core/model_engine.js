import frequencyModel from "../models/frequency_model.js";

import trendModel from "../models/trend_model.js";

import bayesModel from "../models/bayes_model.js";

import markovModel from "../models/markov_model.js";

import omissionModel from "../models/omission_model.js";

import cycleModel from "../models/cycle_model.js";

import matrixModel from "../models/matrix_model.js";

import theoryModel from "../models/dlt_theory_model.js";





class ModelEngine {



    constructor(){


        this.models=[];


        this.weights={};


        this.result=null;



    }







    train(history,features){



        this.models=[];




        this.models.push(

            frequencyModel.analyze(

                features

            )

        );



        this.models.push(

            trendModel.analyze(

                history

            )

        );



        this.models.push(

            bayesModel.analyze(

                features

            )

        );



        this.models.push(

            markovModel.analyze(

                history

            )

        );



        this.models.push(

            omissionModel.analyze(

                history

            )

        );



        this.models.push(

            cycleModel.analyze(

                history

            )

        );



        this.models.push(

            matrixModel.analyze(

                history

            )

        );



        this.models.push(

            theoryModel.analyze(

                history

            )

        );






        this.calculateWeights();



        this.result=

        this.merge();




        return this.result;


    }







    calculateWeights(){



        let total=

        this.models.length;



        this.models.forEach(model=>{


            this.weights[model.name]=

            Number(

                (

                1/total

                )

                .toFixed(3)

            );



        });



    }








    merge(){



        let final={};





        for(let n=1;n<=35;n++){



            final[n]=0;



        }







        this.models.forEach(model=>{


            let weight=

            this.weights[model.name];



            Object.keys(

                model.scores

            )

            .forEach(n=>{



                final[n]+=

                Number(

                    model.scores[n] || 0

                )

                *

                weight;



            });



        });







        return {


            scores:final,


            weights:this.weights,


            models:this.models.map(

                m=>m.name

            )


        };



    }







    getResult(){


        return this.result;


    }






    getWeights(){


        return this.weights;


    }





}





export default new ModelEngine();