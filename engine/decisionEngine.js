// engine/decisionEngine.js


/*
    DLT-AI CORE V1.0

    Decision Engine

    AI综合评分中心

*/



const fs = require("fs");
const path = require("path");



const sumModel =
require("../models/sumModel");


const spanModel =
require("../models/spanModel");


const zoneModel =
require("../models/zoneModel");


const frequencyModel =
require("../models/frequencyModel");


const missingModel =
require("../models/missingModel");


const markovModel =
require("../models/markovModel");





// 读取权重配置

function loadWeights(){


    const file =

    path.join(
        __dirname,
        "../config/weights.json"
    );



    return JSON.parse(

        fs.readFileSync(
            file,
            "utf8"
        )

    );


}









function evaluate(
    candidate,
    prediction,
    history
){


    const weights =
    loadWeights();



    const scores={};





    scores.sum =

    sumModel(
        candidate.front,
        prediction.sum
    );





    scores.span =

    spanModel(
        candidate.front,
        prediction.span
    );





    scores.zone =

    zoneModel(
        candidate.front,
        prediction.zone
    );





    scores.frequency =

    frequencyModel(
        candidate.front,
        history
    );





    scores.missing =

    missingModel(
        candidate.front,
        history
    );





    scores.markov =

    markovModel(
        candidate.front,
        history
    );








    const finalScore =



    scores.sum.score
    *
    weights.sum



    +

    scores.span.score
    *
    weights.span



    +

    scores.zone.score
    *
    weights.zone



    +

    scores.frequency.score
    *
    weights.frequency



    +

    scores.missing.score
    *
    weights.missing



    +

    scores.markov.score
    *
    weights.markov;







    return {


        ...candidate,


        scores,


        finalScore:

        Number(
            finalScore.toFixed(2)
        )


    };


}









function decisionEngine(
    candidates,
    prediction,
    history
){



    return candidates

    .map(

        item=>

        evaluate(
            item,
            prediction,
            history
        )

    )

    .sort(

        (a,b)=>

        b.finalScore
        -
        a.finalScore

    );


}





module.exports =
decisionEngine;