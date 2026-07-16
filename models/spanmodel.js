// models/spanModel.js


/*
    DLT-AI CORE V1.0

    Span Model

    功能:

    前区跨度评分

*/



function calculateSpan(front){


    return (

        Math.max(
            ...front
        )

        -

        Math.min(
            ...front
        )

    );


}





function scoreSpan(
    front,
    prediction
){


    const span =
    calculateSpan(front);



    const min =
    prediction.min;



    const max =
    prediction.max;




    let score;



    if(
        span>=min &&
        span<=max
    ){

        score=100;

    }

    else{


        const distance =

        Math.min(

            Math.abs(
                span-min
            ),

            Math.abs(
                span-max
            )

        );



        score =
        Math.max(
            0,
            100-distance*10
        );


    }




    return {


        value:
        span,


        score:
        Number(
            score.toFixed(2)
        )


    };


}





module.exports =
scoreSpan;