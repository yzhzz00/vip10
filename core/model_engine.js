// DLT-AI-CORE VIP
// core/model_engine.js
//
// 模型调度引擎 V2.1
//
// 负责:
// 1.加载全部模型
// 2.统一训练
// 3.统一输出


import frequencyModel from "../models/frequency_model.js";
import trendModel from "../models/trend_model.js";
import bayesModel from "../models/bayes_model.js";
import markovModel from "../models/markov_model.js";
import omissionModel from "../models/omission_model.js";
import cycleModel from "../models/cycle_model.js";
import matrixModel from "../models/matrix_model.js";
import monteCarloModel from "../models/monte_carlo_model.js";
import dltTheoryModel from "../models/dlt_theory_model.js";



class ModelEngine {


    constructor(){


        this.models={

            frequency:frequencyModel,

            trend:trendModel,

            bayes:bayesModel,

            markov:markovModel,

            omission:omissionModel,

            cycle:cycleModel,

            matrix:matrixModel,

            montecarlo:monteCarloModel,

            theory:dltTheoryModel

        };



        this.results={};


        this.status={};


    }








    train(history){



        Object.keys(this.models)

        .forEach(name=>{



            try{



                let model=

                this.models[name];



                model.train(

                    history

                );



                this.results[name]=

                model.analyze();



                this.status[name]={


                    state:"active",


                    error:null



                };



            }

            catch(error){



                console.log(

                    name,

                    "模型失败",

                    error.message

                );



                this.status[name]={


                    state:"failed",


                    error:error.message



                };



            }



        });






        return this.results;


    }









    getResults(){



        return this.results;


    }








    getStatus(){



        return this.status;


    }



}





export default new ModelEngine();