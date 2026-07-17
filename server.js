// DLT-AI-CORE VIP
// server.js
//
// 系统启动入口


import express from "express";

import cors from "cors";



import dataEngine from "./core/data_engine.js";

import featureEngine from "./core/feature_engine.js";

import modelEngine from "./core/model_engine.js";

import predictionEngine from "./core/prediction_engine.js";

import learningEngine from "./core/learning_engine.js";

import backtestEngine from "./core/backtest_engine.js";

import storageEngine from "./core/storage_engine.js";



import committee from "./ai/committee.js";

import weightManager from "./ai/weight_manager.js";

import elimination from "./ai/elimination.js";




const app=

express();



app.use(cors());


app.use(

    express.json()

);


app.use(

    express.static(

        "web"

    )

);






let history=[];

let features={};

let models={};







// ======================
// 系统初始化
// ======================

function init(){



    console.log(

        "DLT-AI-CORE VIP启动"

    );







    history=

    dataEngine.getHistory();







    features=

    featureEngine.build(

        history

    );







    modelEngine.train(

        history,

        features

    );







    models=

    modelEngine.analyze();







    weightManager.init(

        modelEngine.list()

    );







    elimination.init(

        modelEngine.list()

    );







    console.log(

        "数据期数:",

        history.length

    );



}









// ======================
// 状态接口
// ======================


app.get(

"/api/status",

(req,res)=>{



    res.json({



        system:

        "DLT-AI-CORE VIP",



        data:

        dataEngine.status(),



        models:

        modelEngine.list()



    });



}

);









// ======================
// 模型结果
// ======================


app.get(

"/api/models",

(req,res)=>{



    res.json(

        models

    );


}

);









// ======================
// 预测接口
// ======================


app.get(

"/api/predict",

(req,res)=>{



    let committeeResult=

    committee.decide(

        models,

        weightManager.get()

    );







    let result=

    predictionEngine.generate(

        committeeResult,

        10

    );







    storageEngine.savePrediction(

        result

    );







    res.json({



        result



    });



}

);









// ======================
// 开奖反馈
// ======================


app.post(

"/api/feedback",

(req,res)=>{



    let record=

    learningEngine.feedback(

        req.body.prediction,

        req.body.actual,

        models

    );







    storageEngine.saveFeedback(

        record

    );







    res.json(

        record

    );



}

);









// ======================
// 回测接口
// ======================


app.get(

"/api/backtest",

(req,res)=>{



    let result=

    backtestEngine.run(

        history,

        ()=>{

            return predictionEngine.generate(

                models,

                5

            );

        }

    );







    storageEngine.saveBacktest(

        result

    );







    res.json(

        result

    );


}

);









init();








app.listen(

3000,

()=>{


console.log(

"运行地址:http://localhost:3000"

);


}

);