// DLT-AI-CORE VIP
// server.js
// Web服务入口


import express from "express";
import cors from "cors";

import Engine from "./core/engine.js";
import Backtest from "./core/backtest.js";
import Feedback from "./core/feedback.js";
import Learning from "./core/learning.js";

import config from "./config.js";



const app = express();



app.use(

    cors()

);



app.use(

    express.json()

);



app.use(

    express.static(

        "./frontend"

    )

);





const engine =

new Engine();



const backtest =

new Backtest();



const feedback =

new Feedback();



const learning =

new Learning();







// ======================
// 系统状态
// ======================

app.get(

"/api/status",

(req,res)=>{


    res.json({

        system:

        "DLT-AI-CORE VIP",

        status:

        engine.status()

    });


}

);









// ======================
// 开始预测
// ======================

app.get(

"/api/predict",

async(req,res)=>{


    try{


        const result =

        await engine.predict();



        res.json(

            result

        );



    }

    catch(e){


        res.status(500)

        .json({

            error:

            e.message

        });



    }


}

);









// ======================
// 历史回测
// ======================

app.get(

"/api/backtest",

(req,res)=>{


    try{


        const period =

        Number(

            req.query.period

        )

        ||

        100;



        const result =

        backtest.run(

            period

        );



        res.json(

            result

        );



    }

    catch(e){


        res.status(500)

        .json({

            error:

            e.message

        });



    }



}

);









// ======================
// 开奖反馈
// ======================

app.post(

"/api/feedback",

(req,res)=>{


    try{


        const result =

        feedback.analyze(

            req.body.prediction,

            req.body.actual

        );



        const learn =

        learning.train(

            result

        );



        res.json({

            feedback:

            result,

            learning:

            learn

        });



    }

    catch(e){


        res.status(500)

        .json({

            error:

            e.message

        });



    }



}

);









// ======================
// 学习状态
// ======================

app.get(

"/api/learning",

(req,res)=>{


    res.json(

        learning.status()

    );



}

);









app.listen(

    config.server.port,

    ()=>{


        console.log(

        "DLT-AI-CORE VIP running on port "

        +

        config.server.port

        );


    }

);