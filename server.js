// DLT-AI-CORE V11 FINAL
// server.js
// 后端服务器入口


import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import Engine from "./core/engine.js";



const __filename =

fileURLToPath(
    import.meta.url
);



const __dirname =

path.dirname(
    __filename
);



const app =

express();



const PORT =

process.env.PORT || 3000;




// 中间件

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




// 初始化引擎

const engine =

new Engine();




async function start(){


    try{


        await engine.init();



        console.log(
            "DLT-AI-CORE initialized"
        );



    }


    catch(error){


        console.error(

            "Engine init failed:",

            error

        );


        process.exit(1);


    }



}



start();





// =========================
// 系统状态
// =========================


app.get(

    "/api/status",

    (req,res)=>{


        res.json(

            engine.status()

        );


    }

);






// =========================
// 开始预测
// =========================


app.post(

    "/api/predict",

    async(req,res)=>{


        try{


            const result =

            await engine.predict();



            res.json(result);



        }


        catch(error){


            res.status(500)

            .json({


                error:

                error.message


            });


        }



    }

);






// =========================
// 历史回测
// =========================


app.get(

    "/api/backtest",

    async(req,res)=>{


        try{


            const result =

            await engine.runBacktest();



            res.json(result);



        }


        catch(error){


            res.status(500)

            .json({


                error:

                error.message


            });


        }



    }

);






// =========================
// AI学习状态
// =========================


app.get(

    "/api/learning",

    (req,res)=>{


        res.json(

            engine.feedback.getReport()

        );


    }

);






// =========================
// 前端路由
// Express 5不能使用 *
// =========================


app.use(

    (req,res,next)=>{


        if(
            req.method !== "GET"
        ){

            return next();

        }



        res.sendFile(

            path.join(

                __dirname,

                "public",

                "index.html"

            )

        );


    }

);






app.listen(

    PORT,

    ()=>{


        console.log(

            "DLT-AI-CORE running on port "

            +

            PORT

        );


    }

);