const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();


app.use(cors());

app.use(express.json());



// 加载前端

app.use(
    express.static(
        path.join(
            __dirname,
            "frontend"
        )
    )
);



// 首页

app.get("/", function(req,res){

    res.sendFile(

        path.join(
            __dirname,
            "frontend",
            "index.html"
        )

    );

});



// 测试接口

app.get("/api/test",function(req,res){

    res.json({

        status:"ok",

        version:"V1.0.0"

    });

});



// AI接口占位

app.get("/api/analyze",function(req,res){

    res.json({

        success:true,

        message:"AI系统连接成功",

        ranking:[]

    });

});




const PORT =
process.env.PORT || 3000;



app.listen(
    PORT,
    function(){

        console.log(
            "DLT-AI CORE V1.0.0 running"
        );

    }
);