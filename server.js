/*
    DLT-AI CORE

    Server

    Version:
    V1.0.0

*/


const express = require("express");

const cors = require("cors");

const path = require("path");


const runAI = require("./app");



const app = express();



const PORT = 3000;



// 跨域

app.use(cors());


// JSON解析

app.use(
    express.json()
);



// 静态网页

app.use(

    express.static(

        path.join(
            __dirname,
            "frontend"
        )

    )

);




// 首页测试

app.get(
    "/",
    (req,res)=>{


        res.json({

            system:
            "DLT-AI CORE",


            version:
            "V1.0.0",


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






// 开奖反馈接口

app.post(

    "/api/feedback",

    (req,res)=>{


        res.json({

            success:true,


            message:
            "反馈已接收"


        });



    }

);







app.listen(

    PORT,

    ()=>{


        console.log(

        `
DLT-AI CORE V1.0.0

Server running:

http://localhost:${PORT}

`

        );


    }

);