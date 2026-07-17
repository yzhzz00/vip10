// DLT-AI-CORE V11 FINAL
// server.js
// 主服务器入口


import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import Engine from "./core/engine.js";
import System from "./core/system.js";



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





// =====================
// 中间件
// =====================


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







// =====================
// 系统初始化
// =====================


const system =

new System();



const engine =

new Engine();







// =====================
// 状态接口
// =====================


app.get(

    "/api/status",

    async(req,res)=>{


        try{


            res.json({


                status:

                "running",



                version:

                "V11 FINAL",



                history:

                engine.history.length,



                models:

                [

                    "frequency",

                    "trend",

                    "bayes",

                    "markov",

                    "montecarlo"

                ]



            });



        }

        catch(error){


            system.error(error);



            res.status(500)

            .json({

                error:

                error.message

            });


        }


    }

);








// =====================
// 智能预测
// =====================


app.post(

    "/api/predict",

    async(req,res)=>{


        try{


            const result =

            await engine.predict();



            res.json(

                result

            );


        }


        catch(error){


            system.error(error);



            res.status(500)

            .json({


                error:

                error.message



            });


        }


    }


);








// =====================
// 历史回测
// =====================


app.post(

    "/api/backtest",

    async(req,res)=>{


        try{


            const result =

            await engine.backtest();



            res.json(

                result

            );


        }


        catch(error){


            system.error(error);



            res.status(500)

            .json({

                error:

                error.message

            });


        }


    }

);








// =====================
// AI学习状态
// =====================


app.get(

    "/api/learning",

    async(req,res)=>{


        try{


            const result =

            await engine.learning();



            res.json(

                result

            );


        }

        catch(error){


            system.error(error);



            res.status(500)

            .json({

                error:

                error.message

            });


        }


    }

);








// =====================
// 前端页面
// Express 5兼容写法
// 不使用 app.get("*")
// =====================


app.use(

    (req,res)=>{


        res.sendFile(

            path.join(

                __dirname,

                "public",

                "index.html"

            )

        );


    }

);








// =====================
// 启动
// =====================


app.listen(

    PORT,

    ()=>{


        console.log(

            "DLT-AI-CORE V11 FINAL running on port "

            +

            PORT

        );


    }

);