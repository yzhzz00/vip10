// DLT-AI-CORE VIP
// core/engine.js
//
// 总调度引擎
//
// 作用:
// 串联整个预测流程
//
// 数据
// ↓
// 特征
// ↓
// 六大模型
// ↓
// 候选生成
// ↓
// 结构过滤
// ↓
// 综合评分
// ↓
// AI委员会
// ↓
// 输出结果


import data from "./data.js";

import features from "./features.js";

import frequency from "./frequency.js";

import trend from "./trend.js";

import bayes from "./bayes.js";

import markov from "./markov.js";

import omission from "./omission.js";

import cycle from "./cycle.js";

import candidate from "./candidate.js";

import filter from "./filter.js";

import score from "./score.js";

import aiCommittee from "./ai_committee.js";





class Engine {



    constructor(){


        this.models={


            frequency,


            trend,


            bayes,


            markov,


            omission,


            cycle


        };




        this.lastResult=null;


    }









    // ======================
    // 初始化训练
    // ======================

    train(){



        const history=

        data.getHistory();






        features.build(

            history

        );








        frequency.train(

            history

        );





        trend.train(

            history

        );





        bayes.train(

            history

        );





        markov.train(

            history

        );





        omission.train(

            history

        );





        cycle.train(

            history

        );






        filter.train(

            history

        );






        return {


            status:

            "training_complete",



            history:

            history.length



        };



    }









    // ======================
    // 执行预测
    // ======================

    predict(){



        const history=

        data.getHistory();







        // 生成号码池

        candidate.buildPool(

            this.models

        );








        // 生成候选

        let candidates=

        candidate.generate();








        // 结构过滤

        candidates=

        filter.filter(

            candidates

        );









        // 综合评分

        let ranked=

        score.evaluate(

            candidates,

            this.models,

            history

        );









        // AI会议

        let meeting=

        aiCommittee.meeting(

            ranked,

            this.models

        );









        this.lastResult={



            time:

            new Date()

            .toISOString(),



            totalCandidates:

            candidates.length,



            ranking:

            ranked.slice(

                0,

                10

            ),



            aiMeeting:

            meeting



        };








        return this.lastResult;


    }









    // ======================
    // 全流程
    // ======================

    run(){



        this.train();



        return this.predict();



    }









    // ======================
    // 状态
    // ======================

    status(){



        return {


            system:

            "DLT-AI-CORE VIP",



            trained:

            true,



            models:

            Object.keys(

                this.models

            ),



            result:

            this.lastResult!==null



        };


    }



}





export default new Engine();