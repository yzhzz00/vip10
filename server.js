/**
 * DLT-AI-CORE VIP
 * Server V3.0 FINAL
 */


import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";



import DataEngine
from "./core/data_engine.js";


import FeatureEngine
from "./core/feature_engine.js";


import ModelEngine
from "./core/model_engine.js";


import PredictionEngine
from "./core/prediction_engine.js";


import BacktestEngine
from "./core/backtest_engine.js";


import LearningEngine
from "./core/learning_engine.js";


import OutputEngine
from "./core/output_engine.js";





const __filename =
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);





const app =
express();




app.use(
express.json()
);




app.use(

express.static(

path.join(

__dirname,

"public"

)

)

);








const PORT =
process.env.PORT || 3000;








// ========================
// 初始化
// ========================


let history=[];

let models={};





async function init(){



    const dataEngine =
    new DataEngine();



    history =
    await dataEngine.load();



    const featureEngine =
    new FeatureEngine();



    const features =
    await featureEngine.build(
        history
    );





    const modelEngine =
    new ModelEngine();




    models =
    await modelEngine.train(

        history,

        features

    );




    console.log(

        "DLT-AI-CORE VIP初始化完成"

    );



    console.log(

        "历史数据:",

        history.length

    );



}







// ========================
// 状态接口
// ========================


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
            models
        ),



        timestamp:

        new Date()

        .toISOString()



    });


}

);









// ========================
// 数据接口
// ========================


app.get(

"/api/data",

(req,res)=>{


    res.json({


        count:

        history.length,



        latest:

        history[
            history.length-1
        ]


    });


}

);









// ========================
// 预测接口
// ========================


app.get(

"/api/predict",

async(req,res)=>{



    try{



        const engine =

        new PredictionEngine(

            models

        );



        const result =

        await engine.predict();




        const output =

        new OutputEngine();



        res.json(

            output.prediction(

                result.predictions,

                models

            )

        );




    }catch(e){



        res.status(500)

        .json({

            error:

            e.message

        });



    }



}

);









// ========================
// Monte Carlo
// ========================


app.get(

"/api/montecarlo",

(req,res)=>{


    res.json({


        status:

        "ready",



        message:

        "Monte Carlo引擎已连接"



    });


}

);









// ========================
// 回测
// ========================


app.get(

"/api/backtest",

async(req,res)=>{



    try{



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





        res.json({



            "100期":

            result100,



            "500期":

            result500,



            "1000期":

            result1000



        });





    }catch(e){



        res.status(500)

        .json({

            error:e.message

        });


    }




}

);









// ========================
// 学习反馈
// ========================


app.post(

"/api/learn",

async(req,res)=>{



    try{



        const engine =

        new LearningEngine();




        const data =

        engine.parseInput(

            req.body.front,

            req.body.back

        );





        const result =

        await engine.update(

            data,

            models

        );





        res.json(result);





    }catch(e){



        res.status(500)

        .json({

            error:

            e.message

        });


    }




}

);










// ========================
// 启动
// ========================


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