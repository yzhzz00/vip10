import {

bayesianScore

} from "./bayesian.js";



import {

markovScore,

getLastDraw

} from "./markov.js";



import {

monteCarloScore

} from "./montecarlo.js";



import {

scoreNumber

} from "../model/model_score.js";








function fusionScore(numbers){



    const last=

    getLastDraw();



    let bayes=0;



    numbers.forEach(num=>{


        bayes +=

        bayesianScore(num);


    });





    bayes =

    bayes /

    numbers.length;







    let markov=0;



    numbers.forEach(num=>{


        markov +=

        markovScore(

            num,

            last

        );


    });






    const monte =

    monteCarloScore(

        numbers

    );






    const structure =

    scoreNumber(

        numbers

    );







    const finalScore =



    bayes

    *

    0.25



    +



    markov

    *

    0.20



    +



    monte

    *

    0.20



    +



    structure

    *

    0.35;








    return Number(

        finalScore.toFixed(3)

    );



}









function rankCandidates(list){



    return list.map(item=>{


        return {


            ...item,


            score:

            fusionScore(

                item.front

            )


        };


    })

    .sort(

        (a,b)=>

        b.score-a.score

    );



}









export {


    fusionScore,


    rankCandidates


};