/**
 * DLT-AI-CORE VIP
 * Server V4.0 FINAL
 */


import express from "express";
import path from "path";
import { fileURLToPath } from "url";


import DataEngine from "./core/data_engine.js";
import FeatureEngine from "./core/feature_engine.js";
import ModelEngine from "./core/model_engine.js";
import PredictionEngine from "./core/prediction_engine.js";
import BacktestEngine from "./core/backtest_engine.js";
import LearningEngine from "./core/learning_engine.js";
import OutputEngine from "./core/output_engine.js";




const app = express();


const PORT =
process.env.PORT || 3000;



const __filename =
fileURLToPath(import.meta.url);


const __dirname =
path.dirname(__filename);





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







let history=[];

let features={};

let models={};







async function init(){



    const dataEngine =
    new DataEngine();



    history =
    await dataEngine.load();





    const featureEngine =
    new FeatureEngine();



    features =
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

        "DLT-AI-CORE VIP启动完成"

    );



    console.log(

        "历史数据:",

        history.length

    );



}










// =====================
// 状态
// =====================


app.get(

"/api/status",

(req,res)=>{


    res.json({


        system:

        "DLT-AI-CORE VIP",



        status:

        "running",



        history:

        history.length,



        models:

        Object.keys(

            models

        )



    });


}

);









// =====================
// 数据
// =====================


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









// =====================
// 预测
// =====================


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









// =====================
// 回测
// =====================


app.get(

"/api/backtest",

async(req,res)=>{


    try{



        const engine =

        new BacktestEngine();




        const result={



            "100期":

            await engine.run(

                history,

                100

            ),



            "500期":

            await engine.run(

                history,

                500

            ),



            "1000期":

            await engine.run(

                history,

                1000

            )



        };




        const output =

        new OutputEngine();




        res.json(

            output.backtest(

                result

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









// =====================
// 学习反馈
// =====================


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





        const output =

        new OutputEngine();




        res.json(

            output.learning(

                result

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










init()

.then(()=>{


    app.listen(

        PORT,

        ()=>{


            console.log(

            "PORT:",

            PORT

            );


        }

    );


});