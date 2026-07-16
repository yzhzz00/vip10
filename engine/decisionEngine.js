// engine/decisionEngine.js



const weights =
require("../config/weights.json");



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








function decisionEngine(
    candidates,
    prediction,
    history
){



    return candidates.map(

        item=>{


            const scores={};



            scores.sum=

            sumModel(
                item.front,
                prediction.sum
            );



            scores.span=

            spanModel(
                item.front,
                prediction.span
            );



            scores.zone=

            zoneModel(
                item.front,
                prediction.zone
            );



            scores.frequency=

            frequencyModel(
                item.front,
                history
            );



            scores.missing=

            missingModel(
                item.front,
                history
            );



            scores.markov=

            markovModel(
                item.front,
                history
            );






            const finalScore=

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


                ...item,


                scores,


                finalScore:

                Number(
                    finalScore.toFixed(2)
                )


            };

        }

    );



}





module.exports =
decisionEngine;