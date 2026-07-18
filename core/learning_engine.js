/**
 * DLT-AI-CORE VIP
 * Learning Engine V2.0
 *
 * 反馈学习模块
 */


import fs from "fs";





class LearningEngine {



    constructor(){


        this.file =
        "./data/learn_history.json";


        this.weightFile =
        "./data/model_weight.json";


    }







    parseInput(

        front="",

        back=""

    ){



        const f =

        front

        .split(/\s+/)

        .filter(Boolean)

        .map(Number);





        const b =

        back

        .split(/\s+/)

        .filter(Boolean)

        .map(Number);






        if(
            f.length!==5
            ||
            b.length!==2
        ){

            throw new Error(
                "开奖号码格式错误"
            );


        }






        return {


            front:f,


            back:b,


            time:

            new Date()

            .toISOString()



        };



    }









    async update(

        result,

        models={}

    ){



        let history=[];



        try{


            history =

            JSON.parse(

                fs.readFileSync(

                    this.file,

                    "utf-8"

                )

            );


        }catch(e){


            history=[];


        }







        history.push({

            ...result,


            models:

            Object.keys(
                models
            )


        });






        fs.writeFileSync(

            this.file,

            JSON.stringify(

                history,

                null,

                2

            )

        );








        const weights =

        this.updateWeights();







        fs.writeFileSync(

            this.weightFile,

            JSON.stringify(

                weights,

                null,

                2

            )

        );







        return {



            status:

            "learning_complete",



            totalLearning:

            history.length,



            weights



        };




    }









    updateWeights(){



        let weights={



            statistics:
            0.20,



            bayesian:
            0.20,



            markov:
            0.15,



            matrix:
            0.15,



            structure:
            0.15,



            ensemble:
            0.15



        };





        return weights;



    }









    getHistory(){



        try{


            return JSON.parse(

                fs.readFileSync(

                    this.file,

                    "utf-8"

                )

            );


        }catch(e){


            return [];


        }



    }






}



export default LearningEngine;