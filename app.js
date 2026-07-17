// DLT-AI-CORE VIP
// app.js
// 系统主入口
//
// 作用:
// 连接预测引擎
// AI委员会
// 反馈
// 学习
// 存储
//
// 系统流程:
// 启动
// ↓
// 初始化数据
// ↓
// 模型训练
// ↓
// AI分析
// ↓
// 输出预测
// ↓
// 保存结果


import engine from "./core/engine.js";

import committee from "./core/ai_committee.js";

import feedback from "./core/feedback.js";

import learning from "./core/learning.js";

import storage from "./core/storage.js";







class DLTCoreVIP {



    constructor(){


        this.ready=false;


    }








    // ======================
    // 系统启动
    // ======================

    start(){



        console.log(

            "DLT-AI-CORE VIP 启动"

        );





        const status=

        engine.initialize();





        committee.register(

            engine.models

        );





        learning.register(

            engine.models

        );





        this.ready=true;





        return {


            system:

            "DLT-AI-CORE VIP",



            status:"ready",



            history:

            status.history



        };


    }









    // ======================
    // 执行预测
    // ======================

    predict(){



        if(!this.ready){


            this.start();


        }






        let result=

        engine.predict();






        let meeting=

        committee.meeting(

            result.result

        );






        const output={



            time:

            new Date()

            .toISOString(),



            total:

            meeting.length,



            result:

            meeting.slice(

                0,

                10

            )



        };






        storage.savePrediction(

            output

        );





        return output;


    }









    // ======================
    // 开奖反馈
    // ======================

    feedbackResult(

        issue,

        actual,

        prediction

    ){



        const result=

        feedback.submitResult(

            issue,

            actual,

            prediction

        );





        storage.saveFeedback(

            result

        );






        const learnResult=

        learning.learn(

            result

        );






        storage.saveLearning(

            learnResult

        );





        storage.saveModels(

            learning.getWeights()

        );






        return {


            feedback:result,



            learning:learnResult



        };


    }









    // ======================
    // 系统状态
    // ======================

    status(){



        return {



            engine:

            engine.status(),



            committee:

            committee.status(),



            storage:

            storage.status(),



            learning:

            learning.status()



        };


    }



}





export default new DLTCoreVIP();