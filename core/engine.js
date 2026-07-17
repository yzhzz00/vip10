// DLT-AI-CORE V11 FINAL
// core/engine.js
// AI总控制中心


import DataEngine from "./data.js";
import Validator from "./validator.js";
import FeatureEngine from "./feature.js";
import LearningEngine from "./learning.js";
import ReportEngine from "./report.js";

import ModelCommittee from "../models/committee.js";



class Engine {


    constructor(){


        this.data =
        new DataEngine();


        this.validator =
        new Validator();


        this.feature =
        new FeatureEngine();


        this.learning =
        new LearningEngine();


        this.report =
        new ReportEngine();


        this.committee =
        new ModelCommittee();



        this.ready =
        false;


    }







    async initialize(){


        console.log(
            "Initializing DLT-AI-CORE..."
        );


        const history =
        await this.data.load();



        this.validator.check(
            history
        );



        await this.committee.train(
            history
        );



        this.ready =
        true;



        return {

            status:
            "ready",

            samples:
            history.length

        };


    }









    async analyze(){



        if(
            !this.ready
        ){


            throw new Error(
                "Engine not initialized"
            );


        }



        const history =
        await this.data.load();



        const features =
        this.feature.generate(
            history
        );



        const result =
        await this.committee.predict(
            features
        );



        const report =
        this.report.create(
            result
        );



        return {


            result,


            report



        };


    }









    async feedback(data){



        return await this.learning.update(
            data
        );


    }





    getStatus(){


        return {


            ready:
            this.ready,


            version:
            "V11 FINAL"


        };


    }



}



export default Engine;