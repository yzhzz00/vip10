const express = require("express");
const cors = require("cors");


const historyEngine = require("./ai_core/engine/history_engine");

const featureMatrix = require("./ai_core/matrix/feature_matrix");

const rankingEngine = require("./ai_core/engine/ranking_engine");



const app = express();



app.use(cors());

app.use(express.json());





app.get("/", (req,res)=>{

    res.send(
        "dlt ai core v10.4 online"
    );

});






// 历史数据

app.get("/api/history",(req,res)=>{


    const data =
        historyEngine.loadHistory();



    res.json({

        status:"success",

        count:data.length,

        latest:data.slice(-5)

    });


});







// 特征矩阵

app.get("/api/features",(req,res)=>{


    const history =
        historyEngine.loadHistory();



    const matrix =
        featureMatrix.buildMatrix(history);



    res.json({

        status:"success",

        count:matrix.length,

        data:matrix

    });


});







// 评分排序

app.get("/api/ranking",(req,res)=>{


    const history =
        historyEngine.loadHistory();



    const matrix =
        featureMatrix.buildMatrix(history);



    const ranking =
        rankingEngine.rank(matrix);



    res.json({

        status:"success",

        count:ranking.length,

        data:ranking

    });


});







const port =
    process.env.PORT || 3000;



app.listen(
    port,
    "0.0.0.0",
    ()=>{


        console.log(
            "dlt ai core start"
        );


        console.log(
            "port:",
            port
        );


    }
);