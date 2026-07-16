// engine/decisionEngine.js


/*
    DLT-AI CORE

    Decision Engine V1.0


    AI会议评分中心


*/



// 基础模型权重

const defaultWeights = {


    sum:0.25,


    zone:0.25,


    span:0.20,


    oddEven:0.15,


    frequency:0.15


};





// 和值评分

function sumScore(
    candidate,
    portrait
){


    const s =
    candidate.sum;



    const min =
    portrait.sum.range.min;


    const max =
    portrait.sum.range.max;



    if(
        s>=min
        &&
        s<=max
    ){

        return 100;

    }



    const distance =
    Math.min(
        Math.abs(s-min),
        Math.abs(s-max)
    );



    return Math.max(
        0,
        100-distance*10
    );


}






// 三区评分

function zoneScore(
    candidate,
    portrait
){


    if(
        candidate.zone
        ===
        portrait.zone.value
    ){

        return 100;

    }


    return 50;

}





// 跨度评分

function spanScore(
    candidate,
    portrait
){


    const span =
    Math.max(
        ...candidate.front
    )
    -
    Math.min(
        ...candidate.front
    );



    const min =
    portrait.span.range.min;


    const max =
    portrait.span.range.max;



    if(
        span>=min
        &&
        span<=max
    ){

        return 100;

    }


    return 60;

}





// 奇偶评分

function oddEvenScore(
    candidate,
    portrait
){


    let odd=0;


    candidate.front.forEach(
        n=>{

            if(n%2!==0)
                odd++;

        }
    );



    const even =
    5-odd;



    const type =
    `${odd}-${even}`;



    if(
        type
        ===
        portrait.oddEven.value
    ){

        return 100;

    }


    return 50;

}





// 综合评分

function evaluateCandidate(
    candidate,
    portrait,
    weights=defaultWeights
){



    const scores={



        sum:
        sumScore(
            candidate,
            portrait
        ),



        zone:
        zoneScore(
            candidate,
            portrait
        ),



        span:
        spanScore(
            candidate,
            portrait
        ),



        oddEven:
        oddEvenScore(
            candidate,
            portrait
        ),



        frequency:70

    };



    const total =


        scores.sum
        *
        weights.sum



        +

        scores.zone
        *
        weights.zone



        +

        scores.span
        *
        weights.span



        +

        scores.oddEven
        *
        weights.oddEven



        +

        scores.frequency
        *
        weights.frequency;




    return {


        ...candidate,


        scores,


        finalScore:
        Number(
            total.toFixed(2)
        )


    };


}





// 批量决策

function decisionEngine(
    candidates,
    portrait
){


    return candidates

    .map(
        item=>

        evaluateCandidate(
            item,
            portrait
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