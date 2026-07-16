// models/spanModel.js


/*
    跨度评分模型
*/



function spanModel(
    numbers,
    range
){


    const span =

    Math.max(...numbers)

    -

    Math.min(...numbers);



    let score=100;



    if(
        span<range.min
        ||
        span>range.max
    ){

        score-=45;

    }
    else{


        const center =

        (
            range.min
            +
            range.max
        )
        /
        2;



        score-=

        Math.abs(
            span-center
        );

    }



    if(score<0){

        score=0;

    }




    return {


        span,


        score:

        Number(
            score.toFixed(2)
        )


    };


}



module.exports =
spanModel;