// DLT-AI-CORE VIP
// server.js
//
// 系统启动入口 V3.0


import express from "express";

import cors from "cors";

import path from "path";

import {

    fileURLToPath

} from "url";



import dataEngine from "./core/data_engine.js";

import modelEngine from "./core/model_engine.js";

import predictionEngine from "./core/prediction_engine.js";

import storageEngine from "./core/storage_engine.js";

import committee from "./ai/committee.js";

import weightManager from "./ai/weight_manager.js";

import elimination from "./ai/elimination.js";





const app = express();



app.use(cors());


app.use(express.json());





const __filename=

fileURLToPath(

    import.meta.url

);



const __dirname=

path.dirname(

    __filename

);





app.use(

express.static(

path.join(

__dirname,

"web"

)

)

);







let systemStatus={


    progress:0,


    status:"starting",


    steps:[]



};






let models={};



function step(percent,message){



    systemStatus.steps.push({


        percent,


        message,


        time:new Date()


    });



    systemStatus.progress=percent;


}









function init(){



    try{



        step(

            10,

            "读取历史数据"

        );





        dataEngine.load(

            "./data/dlt_history.txt"

        );






        let history=

        dataEngine.getHistory();







        if(

            history.length===0

        ){



            throw new Error(

                "历史数据为空"

            );


        }








        step(

            30,

            "生成历史特征"

        );







        step(

            50,

            "多模型分析"

        );







        models=

        modelEngine.train(

            history

        );








        step(

            65,

            "模型融合评分"

        );







        weightManager.init(

            Object.keys(models)

        );







        elimination.init(

            Object.keys(models)

        );








        step(

            75,

            "生成候选组合"

        );







        step(

            85,

            "结构过滤"

        );







        step(

            95,

            "最终评分排序"

        );







        systemStatus.progress=100;


        systemStatus.status="complete";



        console.log(

            "DLT-AI-CORE VIP启动完成"

        );




    }

    catch(error){



        console.log(

            "启动失败:",

            error.message

        );



        systemStatus.status=

        "error";



        systemStatus.error=

        error.message;



    }



}









app.get(

"/api/status",

(req,res)=>{


    res.json({


        system:

        "DLT-AI-CORE VIP",



        status:

        systemStatus



    });



}

);









app.get(

"/api/models",

(req,res)=>{



    res.json({

        models,

        status:

        modelEngine.getStatus()

    });


}

);









app.get(

"/api/predict",

(req,res)=>{



    try{



        let result=

        predictionEngine.generate(

            models,

            10

        );







        storageEngine.savePrediction(

            result

        );







        res.json({

            result

        });



    }

    catch(error){



        res.json({



            error:

            error.message



        });


    }



}

);









app.get(

"/api/backtest",

(req,res)=>{



    res.json({



        message:

        "backtest ready"



    });



}

);









init();







const PORT=

process.env.PORT

||

3000;







app.listen(

PORT,

()=>{


console.log(

"Server running on",

PORT

);


}

);