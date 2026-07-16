const express = require("express");
const cors = require("cors");
const path = require("path");

const runAI = require("./app");


const server = express();


server.use(cors());

server.use(express.json());


// 加载网页目录

server.use(
    express.static(
        path.join(
            __dirname,
            "frontend"
        )
    )
);


// 首页

server.get("/", (req,res)=>{

    res.sendFile(

        path.join(
            __dirname,
            "frontend",
            "index.html"
        )

    );

});


// 测试接口

server.get(
    "/api/test",
    (req,res)=>{

        res.json({

            status:"ok",

            version:"V1.0.0"

        });

    }
);


// AI接口

server.get(
    "/api/analyze",
    (req,res)=>{

        res.json(

            runAI()

        );

    }
);



const PORT =
process.env.PORT || 3000;



server.listen(
    PORT,
    ()=>{

        console.log(
            "DLT-AI CORE V1.0.0 running"
        );

    }
);