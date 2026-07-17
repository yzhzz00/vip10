// DLT-AI-CORE V11 FINAL
// core/learning.js
// 自主学习引擎


import fs from "fs/promises";


class LearningEngine {


    constructor(){


        this.stateFile =
        "./data/model_state.json";


        this.learningRate =
        0.05;


    }







    async update(feedback){


        const state =
        await this.loadState();



        const result =
        this.evaluate(
            feedback
        );



        this.updateModels(
            state,
            result
        );



        state.learning.updates++;



        state.learning.last_feedback =
        new Date()
        .toISOString();



        await this.saveState(
            state
        );



        return state;


    }









    evaluate(feedback){


        const models =
        feedback.models
        ||
        {};



        const score =
        feedback.score
        ||
        0;



        return {


            models,


            score



        };


    }









    updateModels(
        state,
        result
    ){


        Object.keys(
            state.models
        )
        .forEach(
            name=>{


                const model =
                state.models[name];



                const performance =
                result.models[name]
                ||
                0;



                model.score =

                model.score
                *
                (1-this.learningRate)

                +

                performance
                *
                this.learningRate;



                model.weight =
                this.normalize(
                    model.score
                );



                model.train_count++;



            }
        );


    }









    normalize(value){


        return Number(

            Math.max(
                0.05,
                Math.min(
                    0.5,
                    value
                )
            )
            .toFixed(4)

        );


    }









    async loadState(){


        const text =
        await fs.readFile(
            this.stateFile,
            "utf-8"
        );


        return JSON.parse(
            text
        );


    }









    async saveState(state){


        await fs.writeFile(

            this.stateFile,

            JSON.stringify(
                state,
                null,
                2
            )

        );


    }



}



export default LearningEngine;