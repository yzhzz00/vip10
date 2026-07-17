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
process.env.PORT
||
3000;





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






// 创建AI核心实例

const engine =
new Engine();





// 初始化系统

async function initSystem(){


    try{


        await engine.init();



        console.log(
            "AI Engine initialized"
        );


    }


    catch(error){


        console.error(

            "Engine initialization failed:",
            error

        );


    }


}





// 状态接口

app.get(
    "/api/status",
    async(req,res)=>{


        res.json({

            status:
            "running",


            history:
            engine.historyCount
            ||
            0,


            models:
            "frequency trend bayes markov montecarlo"

        });


    }

);







// 预测接口

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


            console.error(
                error
            );


            res.status(500)
            .json({

                error:
                error.message

            });


        }


    }

);







// Express 5 fallback
// 不使用 app.get("*")

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








// 启动服务器

async function start(){


    await initSystem();



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


}



start();