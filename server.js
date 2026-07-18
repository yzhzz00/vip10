/**
 * DLT-AI-CORE VIP
 * Server V4.1 FINAL
 */


import express from "express";
import path from "path";
import { fileURLToPath } from "url";


import DataEngine from "./core/data_engine.js";
import FeatureEngine from "./core/feature_engine.js";
import PredictionEngine from "./core/prediction_engine.js";
import LearningEngine from "./core/learning_engine.js";


import StatisticsModel from "./models/statistics_model.js";
import BayesianModel from "./models/bayesian_model.js";
import MarkovModel from "./models/markov_model.js";
import MatrixModel from "./models/matrix_model.js";
import StructureModel from "./models/structure_model.js";
import EnsembleModel from "./models/ensemble_model.js";





const app = express();



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);





app.use(express.json());





app.use(

express.static(

path.join(

__dirname,

"public"

)

)

);









const dataEngine =

new DataEngine();



const featureEngine =

new FeatureEngine();



const learningEngine =

new LearningEngine();









let system={};









async function trainSystem(){



const history =

await dataEngine.load();





const features =

await featureEngine.build(

history

);






const statistics =

new StatisticsModel()

.train(

history,

features

);





const bayesian =

new BayesianModel()

.train(

history,

features

);





const markov =

new MarkovModel()

.train(

history

);





const matrix =

new MatrixModel()

.train(

history

);





const structure =

new StructureModel()

.train(

history

);







const ensemble =

new EnsembleModel()

.train({


statistics,

bayesian,

markov,

matrix,

structure


});






system={



history,



features,



models:{


statistics,


bayesian,


markov,


matrix,


structure,


ensemble


}



};





console.log(

"DLT-AI-CORE VIP READY"

);



}









app.get(

"/api/status",

(req,res)=>{


res.json({



system:

"DLT-AI-CORE VIP",



history:

system.history.length,



models:

6



});



}

);









app.get(

"/api/predict",

async(req,res)=>{



try{



const engine=

new PredictionEngine(

system.models,

system.features

);





const result=

await engine.predict();





learningEngine

.savePrediction(

result.predictions[0]

);





res.json(result);



}

catch(e){



res.status(500)

.json({

error:e.message

});


}



}

);









app.post(

"/api/learn",

async(req,res)=>{



try{



const result=

await learningEngine.learn(

req.body

);



res.json(result);



}

catch(e){



res.status(500)

.json({

error:e.message

});


}



}

);









trainSystem();








app.listen(

3000,

()=>{


console.log(

"Server running: 3000"

);



}

);