// DLT-AI-CORE V11 FINAL
// core/engine.js
// AI总控制中心


import DataManager from "./data.js";
import Committee from "../models/committee.js";
import Score from "./score.js";
import Feature from "./feature.js";


class Engine {


    constructor(config = {}){


        this.config = config;


        this.history = [];


        this.historyCount = 0;


        this.data =
        new DataManager(
            config
        );


        this.feature =
        new Feature(
            config
        );


        this.committee =
        new Committee(
            config
        );


        this.score =
        new Score(
            config
        );


        this.ready = false;


    }






    async init(){


        console.log(
            "Engine initializing..."
        );


        try{


            await this.loadData();


            await this.committee.init?.();


            this.ready = true;


            console.log(
                "Engine ready"
            );


            return true;


        }


        catch(error){


            console.error(
                "Engine init failed:",
                error
            );


            throw error;


        }


    }






    async loadData(){


        try{


            const result =

            await this.data.load();



            if(
                Array.isArray(result)
            ){


                this.history =
                result;


            }



            this.historyCount =
            this.history.length;



            console.log(

                "History loaded:",
                this.historyCount

            );


        }


        catch(error){


            console.error(
                "Data load error:",
                error
            );


            this.history = [];

            this.historyCount = 0;


        }


    }








    async predict(){


        if(
            !this.ready
        ){


            await this.init();


        }



        console.log(
            "Prediction started..."
        );



        const features =

        await this.feature.generate(
            this.history
        );



        const models =

        await this.committee.predict(
            features
        );



        const finalResult =

        await this.score.calculate(
            models
        );



        const prediction = {


            front:

            finalResult.front
            ||
            [],



            back:

            finalResult.back
            ||
            []



        };



        return {


            success:true,


            prediction,


            models,


            historyCount:
            this.historyCount,


            time:
            new Date()
            .toISOString()



        };


    }





}



export default Engine;