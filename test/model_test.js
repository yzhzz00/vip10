/**
 * DLT-AI-CORE VIP
 * Model Test V1.0
 */


import DataEngine from "../core/data_engine.js";
import FeatureEngine from "../core/feature_engine.js";


import StatisticsModel from "../models/statistics_model.js";
import BayesianModel from "../models/bayesian_model.js";
import MarkovModel from "../models/markov_model.js";
import MatrixModel from "../models/matrix_model.js";
import StructureModel from "../models/structure_model.js";





async function test(){



const dataEngine=

new DataEngine();



const featureEngine=

new FeatureEngine();





const history=

await dataEngine.load();





const features=

await featureEngine.build(

history

);







const models=[



new StatisticsModel()

.train(

history,

features

),



new BayesianModel()

.train(

history,

features

),



new MarkovModel()

.train(

history

),



new MatrixModel()

.train(

history

),



new StructureModel()

.train(

history

)



];







models.forEach(

model=>{


console.log(

model.name,

model.top.slice(0,3)

);



});






console.log(

"MODEL TEST PASS"

);



}





test();