// models/frequencyModel.js


/*
    DLT-AI CORE V1.0

    Frequency Model

    功能:

    前区号码频率评分

*/



function buildFrequencyMap(
    history
){


    const map={};



    history.forEach(item=>{


        item.front.forEach(num=>{


            if(!map[num]){

                map[num]=0;

            }


            map[num]++;


        });


    });



    return map;


}







function scoreFrequency(
    front,
    history
){



    const frequency =
    buildFrequencyMap(
        history
    );



    const total =
    history.length;



    let score=0;



    front.forEach(num=>{


        const count =
        frequency[num]
        ||
        0;



        const rate =
        count
        /
        total;



        /*
            大乐透前区理论概率

            单号出现概率约:

            5/35

        */



        const ideal =
        5/35;



        const diff =
        Math.abs(
            rate-ideal
        );



        let numScore =
        100-diff*300;



        if(
            numScore<0
        ){

            numScore=0;

        }



        score+=numScore;



    });





    return {


        score:

        Number(
            (
            score/5
            )
            .toFixed(2)
        ),



        frequency

    };


}





module.exports =
scoreFrequency;