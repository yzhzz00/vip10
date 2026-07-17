// DLT-AI-CORE V11 FINAL
// core/committee.js
// AI模型委员会
// 多模型竞争、评分、融合


import config from "../config.js";


class Committee {


    constructor(){

        this.weights = {

            frequency:
            config.models.frequency.weight,

            trend:
            config.models.trend.weight,

            bayes:
            config.models.bayes.weight,

            markov:
            config.models.markov.weight,

            montecarlo:
            config.models.montecarlo.weight

        };


        this.history = [];


    }





    evaluate(models){


        const scores = {};



        for(const name in models){


            scores[name] =

            this.modelScore(
                models[name]
            );


        }



        const ranking =

        Object.entries(scores)

        .sort(
            (a,b)=>b[1]-a[1]
        );



        return {


            scores,


            ranking,


            weights:this.weights


        };


    }





    // 计算单模型表现

    modelScore(data){


        if(
            !Array.isArray(data)
            ||
            data.length===0
        ){

            return 0;

        }



        let total = 0;



        const limit =

        Math.min(
            data.length,
            10
        );



        for(
            let i=0;
            i<limit;
            i++
        ){


            const value =

            Number(
                data[i][1]
                ||
                0
            );



            total += value;


        }



        return Number(

            (
                total /
                limit
            ).toFixed(4)

        );


    }





    // 委员会最终决策

    decide(models){


        const result={};



        for(const name in models){



            const weight =

            this.weights[name]
            ||
            0.1;



            for(const item of models[name]){


                const number =

                Number(
                    item[0]
                );



                const value =

                Number(
                    item[1]
                    ||
                    0
                );



                result[number]=

                (result[number]||0)

                +

                value * weight;


            }


        }



        return Object.entries(result)

        .sort(
            (a,b)=>b[1]-a[1]
        )

        .slice(0,20);


    }





    // 根据反馈调整模型权重

    updateWeights(performance){


        for(const name in performance){



            if(
                !this.weights[name]
            ){

                continue;

            }



            if(
                performance[name]
                >
                0.7
            ){


                this.weights[name] += 0.01;


            }

            else{


                this.weights[name] -= 0.01;


            }



            // 限制范围

            if(
                this.weights[name]
                <
                config.learning.minModelWeight
            ){


                this.weights[name]
                =
                config.learning.minModelWeight;


            }



            if(
                this.weights[name]
                >
                config.learning.maxModelWeight
            ){


                this.weights[name]
                =
                config.learning.maxModelWeight;


            }


        }



        return this.weights;


    }



}



export default Committee;