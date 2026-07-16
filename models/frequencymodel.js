// models/frequencyModel.js


/*
    频率评分模型
*/



function frequencyModel(
    numbers,
    history
){


    const count={};



    history.forEach(
        item=>{


            item.front.forEach(
                n=>{


                    count[n]=
                    (count[n]||0)+1;


                }
            );


        }
    );





    let total=0;



    numbers.forEach(
        n=>{


            total +=

            count[n]||0;


        }
    );





    const avg =

    total /
    numbers.length;





    let score =

    50
    +
    avg;



    if(score>100){

        score=100;

    }



    return {


        frequency:count,


        score:

        Number(
            score.toFixed(2)
        )


    };


}



module.exports =
frequencyModel;