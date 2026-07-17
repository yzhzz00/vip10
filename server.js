// DLT-AI-CORE VIP
// server.js
//
// Web服务入口
//
// 功能:
// 1.启动网页
// 2.提供AI预测接口
// 3.提供回测接口
// 4.提供学习状态接口


import express from "express";

import path from "path";

import { fileURLToPath } from "url";


import engine from "./core/engine.js";

import backtest from "./core/backtest.js";

import learning from "./core/learning.js";

import storage from "./core/storage.js";





const __filename =

fileURLToPath(

import.meta.url

);



const __dirname =

path.dirname(

__filename

);







const app = express();





const PORT = 3000;







app.use(

express.json()

);







// ======================
// 前端目录
// ======================

app.use(

express.static(

path.join(

__dirname,

"frontend"

)

)

);









// ======================
// 系统状态
// ======================

app.get(

"/api/status",

(req,res)=>{


    res.json(

        engine.status()

    );


}

);









// ======================
// AI预测
// ======================

app.post(

"/api/predict",

(req,res)=>{



    try{



        const result=

        engine.run();





        storage.savePrediction(

            result

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
// 历史回测
// ======================

app.post(

"/api/backtest",

(req,res)=>{



    try{



        const result=

        backtest.run();




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









// ======================
// 反馈接口
// ======================

app.post(

"/api/feedback",

(req,res)=>{



    res.json({


        status:

        "feedback_api_ready"



    });


}

);









// ======================
// 首页
// ======================

app.get(

"*",

(req,res)=>{



    res.sendFile(

        path.join(

            __dirname,

            "frontend/index.html"

        )

    );



}

);









app.listen(

PORT,

()=>{


console.log(

`

=================================

DLT-AI-CORE VIP

SERVER STARTED

PORT:

${PORT}


=================================

`

);



}

);