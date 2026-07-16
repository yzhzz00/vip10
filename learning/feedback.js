// learning/feedback.js


/*
    DLT-AI CORE V1.0

    Feedback Module

    功能:

    预测结果

        ↓

    开奖结果比较

*/



function compareFront(
    predict,
    actual
){


    return predict.filter(
        num =>
        actual.includes(num)
    );


}




function compareBack(
    predict,
    actual
){


    return predict.filter(
        num =>
        actual.includes(num)
    );


}








function feedback(
    prediction,
    actual
){



    const frontHit =

    compareFront(
        prediction.front,
        actual.front
    );



    const backHit =

    compareBack(
        prediction.back,
        actual.back
    );





    return {


        issue:
        actual.issue,



        predict:{


            front:
            prediction.front,


            back:
            prediction.back


        },



        actual:{


            front:
            actual.front,


            back:
            actual.back


        },



        result:{


            frontHit,


            frontCount:
            frontHit.length,



            backHit,


            backCount:
            backHit.length



        },



        time:
        new Date()
        .toISOString()


    };



}





module.exports =
feedback;