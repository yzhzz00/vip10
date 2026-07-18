/**
 * DLT-AI-CORE VIP
 * 主服务器
 */


import express from "express";
import path from "path";
import { fileURLToPath } from "url";


import DataEngine from "./core/data_engine.js";
import FeatureEngine from "./core/feature_engine.js";
import ModelEngine from "./core/model_engine.js";
import PredictionEngine from "./core/prediction_engine.js";
import MonteCarloEngine from "./core/montecarlo_engine.js";
import BacktestEngine from "./core/backtest_engine.js";
import LearningEngine from "./core/learning_engine.js";
import OutputEngine from "./core/output_engine.js";


import {
    PORT,
    DATA_FILE
} from "./config.js";




const app =
express();



app.use(
    express.json()
);



const __filename =
fileURLToPath(
    import.meta.url
);



const __dirname =
path.dirname(
    __filename
);



app.use(
    express.static(
        path.join(
            __dirname,
            "public"
        )
    )
);





let history=[];

let features={};

let modelResult={};





const dataEngine =
new DataEngine(
    DATA_FILE
);



const featureEngine =
new FeatureEngine();



const modelEngine =
new ModelEngine();



const learningEngine =
new LearningEngine();







async function init(){


    console.log(
        "DLT-AI-CORE VIP启动"
    );



    history =
    dataEngine.load();



    console.log(
        "有效历史期数:",
        history.length
    );



    /*
     * 数据为空保护
     */
    if(
        history.length===0
    ){

        console.log(
            "暂无历史数据，等待导入"
        );


        return;

    }




    features =
    featureEngine.extract(
        history
    );



    modelResult =
    await modelEngine.train(
        history,
        features
    );



    console.log(
        "模型初始化完成"
    );


}








/**
 * 首页
 */
app.get(
"/",
(req,res)=>{

    res.sendFile(
        path.join(
            __dirname,
            "public/index.html"
        )
    );

});








/**
 * 状态接口
 */
app.get(
"/api/status",
(req,res)=>{


    res.json({

        system:
        "DLT-AI-CORE VIP",


        history:
        history.length,


        models:
        Object.keys(
            modelResult
        )


    });


});








/**
 * 数据状态
 */
app.get(
"/api/data",
(req,res)=>{


    res.json({

        count:
        history.length,


        latest:
        history[
            history.length-1
        ] || null


    });


});









/**
 * 预测
 */
app.get(
"/api/predict",
async(req,res)=>{


    const engine =
    new PredictionEngine(
        modelResult
    );


    const result =
    await engine.predict();



    OutputEngine
    .savePrediction(
        result
    );



    res.json(
        result
    );


});









/**
 * Monte Carlo
 */
app.get(
"/api/montecarlo",
async(req,res)=>{


    const engine =
    new MonteCarloEngine();



    const result =
    await engine.run(
        100000
    );



    res.json(
        result
    );


});









/**
 * 回测
 */
app.get(
"/api/backtest",
async(req,res)=>{


    const engine =
    new BacktestEngine();



    const result100 =
    await engine.run(
        history,
        100
    );



    const result500 =
    await engine.run(
        history,
        500
    );



    const result1000 =
    await engine.run(
        history,
        1000
    );



    const result={


        "100期":
        result100,


        "500期":
        result500,


        "1000期":
        result1000


    };



    OutputEngine
    .saveBacktest(
        result
    );



    res.json(
        result
    );


});









/**
 * 开奖反馈学习
 */
app.post(
"/api/learn",
async(req,res)=>{


    try{


        const data =
        learningEngine.parseInput(
            req.body.front,
            req.body.back
        );



        const result =
        await learningEngine.update(
            data,
            modelResult
        );



        res.json(
            result
        );


    }catch(error){


        res.status(400)
        .json({

            error:
            error.message

        });


    }


});








init()
.then(()=>{


    app.listen(
        PORT,
        ()=>{


            console.log(
                "服务器运行端口:",
                PORT
            );


        }
    );


});