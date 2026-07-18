// core/learning.js


export class LearningEngine {


    constructor(
        models,
        weightManager
    ){


        this.models =
            models;


        this.weights =
            weightManager;


        this.logs=[];


    }



    // =========================
    // 记录学习日志
    // =========================

    log(
        message
    ){


        this.logs.push({


            time:
            new Date()
            .toLocaleString(),


            message


        });


    }





    // =========================
    // 开奖反馈学习
    // =========================

    feedback(
        realResult,
        predictions
    ){



        predictions.forEach(
            item=>{


                let frontHit =
                    item.candidate.front
                    .filter(
                        n=>
                        realResult.front
                        .includes(n)
                    )
                    .length;



                let backHit =
                    item.candidate.back
                    .filter(
                        n=>
                        realResult.back
                        .includes(n)
                    )
                    .length;



                let score =
                    (
                        frontHit/5
                        +
                        backHit/2
                    )
                    /
                    2;



                this.weights.record(
                    item.model,
                    score
                );



                this.log(

                    item.model
                    +
                    "反馈评分:"
                    +
                    score.toFixed(3)

                );


            }
        );



        this.weights.update();



    }





    // =========================
    // 模型训练循环
    // =========================

    trainRound(
        history
    ){


        this.models.forEach(
            model=>{


                if(
                    model.train
                ){


                    model.train(
                        history
                    );



                    this.log(

                    model.name
                    +
                    "完成训练"

                    );


                }


            }
        );



    }





    // =========================
    // 获取学习状态
    // =========================

    status(){


        return {


            weights:
                this.weights.getWeights(),


            logs:
                this.logs.slice(
                    -20
                )


        };


    }



}