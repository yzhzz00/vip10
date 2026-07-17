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





const engine =
new Engine();





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


            res.status(500)
            .json({


                error:
                error.message


            });


        }



    }

);









app.get(
    "*",
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