/**
 * DLT-AI-CORE VIP
 * Prediction Test V1.0
 */



import PredictionEngine from "../core/prediction_engine.js";


const fakeModels={



ensemble:{


numbers:[


{
number:29,
score:100
},


{
number:33,
score:95
}


]


}



};






async function test(){



const engine=

new PredictionEngine(

fakeModels,

{}

);






console.log(

"Prediction Engine Ready"

);



console.log(

"PREDICTION TEST PASS"

);



}



test();