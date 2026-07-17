import express from "express";

import cors from "cors";

import path from "path";

import { fileURLToPath } from "url";


import dataEngine from "./core/data_engine.js";

import featureEngine from "./core/feature_engine.js";

import modelEngine from "./core/model_engine.js";

import predictionEngine from "./core/prediction_engine.js";

import montecarloModel from "./models/montecarlo_model.js";

import feedbackEngine from "./core/feedback_engine.js";

import learningEngine from "./core/learning_engine.js";

import weightManager from "./ai/weight_manager.js";




const app=express();



app.use(cors());

app.use(express.json());





// 静态网页

const __filename=fileURLToPath(import.meta.url);

const __dirname=path.dirname(__filename);



app.use(

express.static(

path.join(__dirname,"web")

)

);







let system={


status:"starting",

progress:0,

history:0


};





let modelResult=null;

let predictions=[];









function init(){



console.log(

"DLT-AI-CORE VIP启动"

);




let history=

dataEngine.load(

"./data/dlt_history.txt"

);



system.progress=30;



system.history=

history.length;



let features=

featureEngine.build(

history

);



system.progress=50;





modelResult=

modelEngine.train(

history,

features

);



weightManager.init(

modelResult.models

);



system.progress=80;





predictions=

predictionEngine.generate(

modelResult

);



system.progress=100;



system.status="complete";



console.log(

"系统初始化完成"

);



}








// 首页

app.get(

"/",

(req,res)=>{


res.sendFile(

path.join(

__dirname,

"web",

"index.html"

)

);


}

);








app.get(

"/api/status",

(req,res)=>{


res.json({

system:

"DLT-AI-CORE VIP",


status:

system


});


}

);








app.get(

"/api/models",

(req,res)=>{


res.json({


models:

modelResult,


weights:

weightManager.get()



});


}

);








app.get(

"/api/predict",

(req,res)=>{


res.json({

result:

predictions

});


}

);










// 启动蒙特卡罗

app.get(

"/api/montecarlo",

async(req,res)=>{



let result=

await montecarloModel.run(

predictions

);



res.json({

result,

status:

montecarloModel.getStatus()

});



}

);







app.get(

"/api/montecarlo/status",

(req,res)=>{


res.json(

montecarloModel.getStatus()

);


}

);









app.post(

"/api/feedback",

(req,res)=>{



let result=

feedbackEngine.add(

req.body

);



learningEngine.update(

result.hit

);



res.json({

success:true,

result

});


}

);







app.get(

"/api/feedback",

(req,res)=>{


res.json(

feedbackEngine.getAll()

);


}

);








const PORT=

process.env.PORT || 3000;






init();






app.listen(

PORT,

()=>{


console.log(

"SERVER PORT",

PORT

);


}

);