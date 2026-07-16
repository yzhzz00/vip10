// models/missingModel.js


/*
    遗漏评分模型
*/



function calculateMissing(
    number,
    history
){


    let miss=0;



    for(
        let i=history.length-1;
        i>=0;
        i--
    ){


        if(
            history[i]
            .front
            .includes(number)
        ){

            break;

        }


        miss++;


    }



    return miss;


}








function missingModel(
    numbers,
    history
){



    let total=0;



    numbers.forEach(
        n=>{


            const miss=

            calculateMissing(
                n,
                history
            );



            total += miss;


        }
    );





    const avg =

    total /
    numbers.length;





    let score =

    100 -
    Math.abs(
        avg-10
    )
    *
    3;




    if(score<0){

        score=0;

    }



    return {


        averageMissing:

        Number(
            avg.toFixed(2)
        ),



        score:

        Number(
            score.toFixed(2)
        )


    };


}





module.exports =
missingModel;