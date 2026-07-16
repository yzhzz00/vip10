// learning/feedback.js


/*
    开奖反馈模块

*/


function hitNumbers(
    predict,
    actual
){


    return predict.filter(

        n=>actual.includes(n)

    );


}







function feedback(
    prediction,
    result
){



    const frontHit =

    hitNumbers(
        prediction.front,
        result.front
    );



    const backHit =

    hitNumbers(
        prediction.back,
        result.back
    );





    return {


        issue:
        result.issue,



        frontHit,


        backHit,



        frontCount:
        frontHit.length,



        backCount:
        backHit.length,



        time:
        new Date()
        .toISOString()



    };



}



module.exports =
feedback;