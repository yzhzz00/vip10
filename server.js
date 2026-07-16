// server.js


/*
    DLT-AI CORE V1.0

    Web API Server

*/



const express =
require("express");


const cors =
require("cors");



const runAI =
require("./app");



const app =
express();



app.use(
    cors()
);



app.use(
    express.json()
);






// 首页检测接口

app.get(
    "/",
    (req,res)=>{


        res.json({

            system:
            "DLT-AI CORE V1.0",

            status:
            "running"

        });


    }
);









// AI分析接口

app.get(
    "/api/analyze",
    (req,res)=>{


        try{


            const result =
            runAI();



            res.json({

                success:true,

                data:result

            });



        }
        catch(error){


            res.json({

                success:false,

                error:
                error.message

            });


        }



    }
);









// 反馈接口

app.post(
    "/api/feedback",
    (req,res)=>{


        const data =
        req.body;



        res.json({

            success:true,

            message:
            "反馈已接收",

            data

        });


    }
);









const PORT=3000;



app.listen(
    PORT,
    ()=>{


        console.log(

            `
DLT-AI CORE Server running:

http://localhost:${PORT}

            `

        );


    }
);