import {

fusionScore

} from "../ai/fusion.js";


import {

optimize

} from "../ai/optimizer.js";



function buildModel(history){


    const score={};



    history.forEach(n=>{


        score[n]=

        (score[n]||0)+1;


    });



    return score;


}





function dltFullPrediction(
front,
back
){


    const frontModel=

    buildModel(front);



    const backModel=

    buildModel(back);



    const frontPool=

    Array.from(
        {
            length:35
        },
        (_,i)=>i+1
    );



    const backPool=

    Array.from(
        {
            length:12
        },
        (_,i)=>i+1
    );



    const frontResult=

    optimize(
        frontPool,
        frontModel,
        10,
        5
    );



    const backResult=

    optimize(
        backPool,
        backModel,
        10,
        2
    );



    const result=[];



    for(
        let i=0;
        i<10;
        i++
    ){


        result.push({


            front:

            frontResult[i]
            ?
            frontResult[i].combo
            :
            [],



            back:

            backResult[i]
            ?
            backResult[i].combo
            :
            []


        });


    }



    return result;


}





function pl5Prediction(
data
){


    const result=[];



    for(let i=0;i<5;i++){


        const column=

        data.map(
            x=>x[i]
        );



        const model=

        buildModel(column);



        const rank=

        Object.entries(model)

        .sort(
            (a,b)=>
            b[1]-a[1]
        );



        result.push(

            rank
            .slice(0,3)
            .map(
                x=>Number(x[0])
            )

        );


    }



    return result;


}



export {

dltFullPrediction,

pl5Prediction

};