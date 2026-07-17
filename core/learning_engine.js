// DLT-AI-CORE VIP
// core/learning_engine.js
//
// 反馈学习引擎
//
// 功能:
// 1.开奖反馈
// 2.模型评分
// 3.权重调整
// 4.淘汰管理


import weightManager from "../ai/weight_manager.js";

import elimination from "../ai/elimination.js";




class LearningEngine {



    constructor(){


        this.history=[];


    }









    // ======================
    // 处理开奖反馈
    // ======================

    feedback(

        prediction,

        actual,

        modelList

    ){



        let result=

        this.evaluate(

            prediction,

            actual

        );







        let record={



            time:

            new Date()

            .toISOString(),



            prediction,



            actual,



            result



        };







        this.history.push(

            record

        );







        this.updateModels(

            modelList,

            result

        );







        return record;


    }









    // ======================
    // 预测评价
    // ======================

    evaluate(

        prediction,

        actual

    ){



        let best={



            front:0,


            back:0



        };







        prediction.forEach(item=>{



            let front=

            item.front.filter(

                n=>

                actual.front.includes(n)

            )

            .length;







            let back=

            item.back.filter(

                n=>

                actual.back.includes(n)

            )

            .length;







            if(

                front>best.front

            )

                best.front=front;







            if(

                back>best.back

            )

                best.back=back;



        });







        return {



            frontHit:

            best.front,



            backHit:

            best.back,



            score:

            Number(

                (

                (

                best.front/5

                +

                best.back/2

                )

                /

                2

                )

                .toFixed(4)

            )



        };



    }









    // ======================
    // 更新模型
    // ======================

    updateModels(

        models,

        result

    ){



        Object.keys(models)

        .forEach(name=>{



            let score=

            result.score;







            weightManager.update(

                name,

                score

            );







            elimination.update(

                name,

                score

            );



        });



    }









    // ======================
    // 获取学习记录
    // ======================

    get(){



        return this.history;


    }



}





export default new LearningEngine();