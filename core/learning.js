// core/learning.js


export class LearningEngine {


    constructor(
        weights
    ){


        this.weights =
        weights;


        this.logs=[];


    }





    // =====================
    // 日志
    // =====================

    addLog(
        text
    ){


        this.logs.push({

            time:
            new Date()
            .toLocaleTimeString(),


            text


        });



        if(
            this.logs.length>100
        ){

            this.logs.shift();

        }


    }





    // =====================
    // 开奖反馈
    // =====================

    feedback(
        result,
        predictions
    ){


        predictions.forEach(
        item=>{


            let hitFront =

            item.candidate.front
            .filter(
                n=>

                result.front
                .includes(n)

            )
            .length;



            let hitBack =

            item.candidate.back
            .filter(
                n=>

                result.back
                .includes(n)

            )
            .length;



            let score =

            (
                hitFront/5
                +
                hitBack/2
            )
            /
            2;



            if(
                item.model
            ){


                this.weights.record(

                    item.model,

                    score

                );


            }





            this.addLog(

                item.model
                +
                "反馈:"
                +
                score.toFixed(3)

            );



        });



        this.weights.update();



    }





    // =====================
    // 训练记录
    // =====================

    trainRound(
        models,
        history
    ){


        models.forEach(
        model=>{


            if(
                model.train
            ){


                model.train(
                    history
                );



                this.addLog(

                    model.name
                    +
                    "完成学习"

                );


            }


        });



    }





    // =====================
    // 获取状态
    // =====================

    status(){


        return {


            logs:
            this.logs,


            weights:

            this.weights
            .getWeights()



        };


    }



}