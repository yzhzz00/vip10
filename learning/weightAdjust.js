// learning/weightAdjust.js


/*
    DLT-AI CORE V1.0

    Weight Adjust

    功能:

    根据反馈

    自动调整模型权重


*/



function normalize(weights){


    const sum =

    Object.values(weights)
    .reduce(
        (a,b)=>a+b,
        0
    );



    Object.keys(weights)
    .forEach(key=>{


        weights[key]
        =
        Number(
            (
            weights[key]
            /
            sum
            )
            .toFixed(3)
        );


    });



    return weights;


}







function adjustWeights(
    weights,
    performance
){



    const newWeights =
    {
        ...weights
    };





    Object.keys(
        performance
    )
    .forEach(
        key=>{


            const score =
            performance[key];



            /*
                表现好

                +5%

                表现差

                -5%

            */



            if(
                score>=80
            ){

                newWeights[key]
                *=
                1.05;

            }


            else if(
                score<60
            ){

                newWeights[key]
                *=
                0.95;

            }



        }
    );





    return normalize(
        newWeights
    );


}







module.exports =
adjustWeights;