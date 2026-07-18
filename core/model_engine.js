/**
 * DLT-AI-CORE VIP
 * 模型管理引擎
 */


import StatisticsModel from "../models/statistics_model.js";
import BayesianModel from "../models/bayesian_model.js";
import MarkovModel from "../models/markov_model.js";
import MatrixModel from "../models/matrix_model.js";
import StructureModel from "../models/structure_model.js";
import EnsembleModel from "../models/ensemble_model.js";



class ModelEngine {


    constructor(){


        this.models = {


            statistics:
            new StatisticsModel(),


            bayesian:
            new BayesianModel(),


            markov:
            new MarkovModel(),


            matrix:
            new MatrixModel(),


            structure:
            new StructureModel(),


            ensemble:
            new EnsembleModel()


        };


    }




    /**
     * 模型训练
     */
    async train(
        history=[],
        features={}
    ){


        const result={};



        result.statistics =
        this.models.statistics.train(
            history,
            features
        );



        result.bayesian =
        this.models.bayesian.train(
            history,
            features
        );



        result.markov =
        this.models.markov.train(
            history,
            features
        );



        result.matrix =
        this.models.matrix.train(
            history,
            features
        );



        result.structure =
        this.models.structure.train(
            history,
            features
        );



        result.ensemble =
        this.models.ensemble.train(
            result
        );



        return {


            models:
            result,


            timestamp:
            new Date()
            .toISOString()


        };


    }





    /**
     * 获取所有模型评分
     */
    predictScore(
        number
    ){


        const scores=[];



        Object.keys(
            this.models
        )
        .forEach(
            name=>{


                if(
                    this.models[name]
                    .score
                ){

                    scores.push({

                        model:name,

                        score:
                        this.models[name]
                        .score(number)

                    });

                }


            }
        );



        return scores;


    }



}


export default ModelEngine;