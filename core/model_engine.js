// DLT-AI-CORE VIP
// core/model_engine.js
//
// 模型引擎升级版
//
// 功能:
// 1.统一管理9大模型
// 2.输入历史数据和特征
// 3.输出模型分析结果


import frequency from "../models/frequency_model.js";

import trend from "../models/trend_model.js";

import bayes from "../models/bayes_model.js";

import markov from "../models/markov_model.js";

import omission from "../models/omission_model.js";

import cycle from "../models/cycle_model.js";

import matrix from "../models/matrix_model.js";

import monteCarlo from "../models/monte_carlo_model.js";

import dltTheory from "../models/dlt_theory_model.js";





class ModelEngine {



    constructor(){


        this.models={



            frequency,


            trend,


            bayes,


            markov,


            omission,


            cycle,


            matrix,


            monteCarlo,


            dltTheory



        };



        this.result={};


    }









    // ======================
    // 模型训练
    // ======================

    train(

        history,

        features

    ){



        Object.keys(

            this.models

        )

        .forEach(name=>{



            let model=

            this.models[name];







            if(

                model.train

            ){



                model.train(

                    history,

                    features

                );



            }



        });







        return true;


    }









    // ======================
    // 模型分析
    // ======================

    analyze(){



        this.result={};







        Object.keys(

            this.models

        )

        .forEach(name=>{



            let model=

            this.models[name];







            if(

                model.analyze

            ){



                this.result[name]=

                model.analyze();



            }



        });







        return this.result;


    }









    // ======================
    // 获取模型结果
    // ======================

    getResult(){



        return this.result;


    }









    // ======================
    // 获取模型列表
    // ======================

    list(){



        return Object.keys(

            this.models

        );



    }



}





export default new ModelEngine();