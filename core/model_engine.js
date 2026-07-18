/**
 * DLT-AI-CORE VIP
 * Model Engine V3.0 FINAL
 *
 * 六模型管理核心
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









    async train(

        history=[],

        features={}

    ){



        const result={};





        // 五个基础模型训练


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








        // 集成模型


        result.ensemble =

        this.models.ensemble.train(

            result

        );







        return result;



    }









    getModelNames(){



        return Object.keys(

            this.models

        );



    }









    getModels(){



        return this.models;



    }





}






export default ModelEngine;