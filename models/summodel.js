// models/sumModel.js


/*
    和值评分模型
*/


function sumModel(
    numbers,
    range
){


    const sum =

    numbers.reduce(
        (a,b)=>a+b,
        0
    );



    let score = 100;



    if(
        sum < range.min
        ||
        sum > range.max
    ){

        score -= 40;

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



        score -=

        Math.abs(
            sum-center
        )
        *
        1.5;


    }



    if(score<0){

        score=0;

    }



    return {


        sum,


        score:

        Number(
            score.toFixed(2)
        )


    };


}



module.exports =
sumModel;