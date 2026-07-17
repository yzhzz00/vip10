// DLT-AI-CORE V11 FINAL
// models/committee.js
// 模型委员会


import FrequencyModel from "./frequency.js";
import TrendModel from "./trend.js";
import BayesModel from "./bayes.js";
import MarkovModel from "./markov.js";
import MonteCarloModel from "./montecarlo.js";


class ModelCommittee {


    constructor(){


        this.models = {


            frequency:
            new FrequencyModel(),


            trend:
            new TrendModel(),


            bayes:
            new BayesModel(),


            markov:
            new MarkovModel(),


            montecarlo:
            new MonteCarloModel()


        };



        this.weights = {


            frequency:0.2,

            trend:0.2,

            bayes:0.2,

            markov:0.2,

            montecarlo:0.2


        };


    }









    async train(history){


        for(
            const name
            in this.models
        ){


            if(
                this.models[name].train
            ){


                await this.models[name]
                .train(
                    history
                );


            }


        }



        return true;


    }









    async predict(features){


        const results = {};



        for(
            const name
            in this.models
        ){


            results[name] =

            await this.models[name]
            .predict(
                features
            );


        }



        return this.combine(
            results
        );


    }









    combine(results){


        const front = {};
        const back = {};



        for(
            const name
            in results
        ){


            const weight =
            this.weights[name];



            const item =
            results[name];



            item.front.forEach(
                n=>{


                    front[n] =
                    (front[n]||0)
                    +
                    weight;


                }
            );



            item.back.forEach(
                n=>{


                    back[n] =
                    (back[n]||0)
                    +
                    weight;


                }
            );



        }



        return {


            prediction:{


                front:
                this.top(
                    front,
                    5
                ),


                back:
                this.top(
                    back,
                    2
                )


            },


            models:
            results



        };


    }









    top(
        data,
        count
    ){


        return Object.entries(
            data
        )
        .sort(
            (a,b)=>
            b[1]-a[1]
        )
        .slice(
            0,
            count
        )
        .map(
            x=>
            Number(x[0])
        )
        .sort(
            (a,b)=>
            a-b
        );


    }



}



export default ModelCommittee;