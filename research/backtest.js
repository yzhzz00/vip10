// research/backtest.js


/*
    历史回测模块

*/



function hitCount(
    predict,
    actual
){


    return predict.filter(

        n=>actual.includes(n)

    )
    .length;


}







function backtest(
    predictions,
    history
){



    const result=[];




    predictions.forEach(

        (item,index)=>{



            const actual=

            history[index];



            result.push({



                issue:
                actual.issue,



                frontHit:

                hitCount(

                    item.front,

                    actual.front

                ),



                backHit:

                hitCount(

                    item.back,

                    actual.back

                )



            });



        }

    );





    return result;



}







module.exports =
backtest;