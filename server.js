import express from "express";

import cors from "cors";

import dataEngine from "./core/data_engine.js";

import modelEngine from "./core/model_engine.js";

import predictionEngine from "./core/prediction_engine.js";



const app=express();


app.use(cors());

app.use(express.json());



let system={

    status:"starting",

    progress:0

};



let models={};



function init(){


    system.progress=20;


    let history=

    dataEngine.load(

        "./data/dlt_history.txt"

    );



    system.progress=50;



    models=

    modelEngine.train(

        history

    );



    system.progress=100;


    system.status="complete";



    console.log(

        "DLT-AI-CORE VIP启动完成"

    );


}



app.get(

"/api/status",

(req,res)=>{


res.json({

system:"DLT-AI-CORE VIP",

status:system


});


}

);




app.get(

"/api/models",

(req,res)=>{


res.json({

status:

modelEngine.getStatus(),

weights:

models.weights


});


}

);





app.get(

"/api/predict",

(req,res)=>{


let result=

predictionEngine.generate();



res.json({

result


});


}

);





const PORT=

process.env.PORT || 3000;



init();



app.listen(

PORT,

()=>{


console.log(

"PORT",

PORT

);


}

);