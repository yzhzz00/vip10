// DLT-AI-CORE V11 FINAL
// core/feedback.js
// AI持续学习系统
// 模型反馈、权重调整、模型淘汰


import config from "../config.js";


class Feedback {


    constructor(){


        this.history = [];


        this.modelPerformance = {};


    }





    // 记录一次预测反馈

    record(data){


        const {


            prediction,

            actual,

            models,

            scores


        } = data;



        const result = {


            time:

            new Date(),


            prediction,


            actual,


            models,


            scores,


            hit:

            this.calculateHit(
                prediction,
                actual
            )


        };



        this.history.push(result);



        this.updatePerformance(
            result
        );



        return result;


    }





    // 计算命中情况

    calculateHit(prediction,actual){


        if(
            !prediction ||
            !actual
        ){

            return null;

        }



        const front =

        prediction.front.filter(

            n=>

            actual.front.includes(n)

        ).length;



        const back =

        prediction.back.filter(

            n=>

            actual.back.includes(n)

        ).length;



        return {


            front,


            back,


            total:

            front+back


        };


    }





    // 更新模型表现

    updatePerformance(result){


        if(
            !result.models
        ){

            return;

        }



        for(
            const name of result.models
        ){



            if(
                !this.modelPerformance[name]
            ){


                this.modelPerformance[name]={


                    count:0,


                    score:0,


                    average:0


                };


            }



            const item =

            this.modelPerformance[name];



            item.count++;



            const hit =

            result.hit.total
            ||
            0;



            item.score += hit;



            item.average =

            Number(

                (

                    item.score /

                    item.count

                )

                .toFixed(4)

            );


        }


    }





    // 自动调整模型权重

    adjustWeights(weights){


        for(
            const name in weights
        ){



            const performance =

            this.modelPerformance[name];



            if(
                !performance
            ){

                continue;

            }



            if(
                performance.average
                >
                1
            ){



                weights[name]
                +=

                config.learning.adjustRate;



            }

            else{


                weights[name]
                -=

                config.learning.adjustRate;



            }



            // 权重限制


            if(
                weights[name]
                <
                config.learning.minModelWeight
            ){


                weights[name]
                =
                config.learning.minModelWeight;


            }



            if(
                weights[name]
                >
                config.learning.maxModelWeight
            ){


                weights[name]
                =
                config.learning.maxModelWeight;


            }



        }



        return weights;


    }





    // 模型淘汰检测

    eliminate(weights){


        const removed=[];



        for(
            const name in weights
        ){



            if(
                weights[name]
                <=
                config.learning.eliminateThreshold
            ){


                removed.push(name);


            }


        }



        return removed;


    }





    getReport(){


        return {


            total:

            this.history.length,


            performance:

            this.modelPerformance,


            latest:

            this.history.slice(-10)


        };


    }



}



export default Feedback;