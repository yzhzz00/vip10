// models/sumModel.js


/*
    DLT-AI CORE V1.0

    Sum Model

    功能:

    前区和值评分

*/



function calculateSum(front){


    return front.reduce(
        (a,b)=>a+b,
        0
    );


}




function scoreSum(
    front,
    prediction
){


    const sum =
    calculateSum(front);



    const min =
    prediction.min;



    const max =
    prediction.max;





    let score;



    // 在预测范围内

    if(
        sum>=min &&
        sum<=max
    ){

        score=100;

    }


    else{


        const distance =

        Math.min(

            Math.abs(
                sum-min
            ),

            Math.abs(
                sum-max
            )

        );



        score =
        Math.max(
            0,
            100-distance*8
        );


    }




    return {


        value:sum,


        score:
        Number(
            score.toFixed(2)
        )


    };


}





module.exports =
scoreSum;