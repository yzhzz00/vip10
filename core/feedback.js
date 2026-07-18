import {

recordPrediction,

saveCase

} from "../knowledge/knowledge.js";





function comparePrediction(
prediction,
actual
){


    const hit=[];

    const miss=[];



    prediction.forEach(n=>{


        if(actual.includes(n)){


            hit.push(n);


        }

        else{


            miss.push(n);


        }


    });



    return {


        hit,

        miss,


        hitCount:
        hit.length


    };


}






function createFeedback(
prediction,
actual,
model="fusion"
){



    const result =

    comparePrediction(
        prediction,
        actual
    );




    const feedback={


        time:

        new Date()
        .toISOString(),



        model,


        prediction,


        actual,


        result



    };




    // 保存经验记录

    recordPrediction(

        prediction,

        actual

    );




    // 保存案例

    saveCase(

        feedback

    );




    return feedback;



}





export {

comparePrediction,

createFeedback

};