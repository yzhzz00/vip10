// models/missingModel.js


/*
    DLT-AI CORE V1.0

    Missing Model

    功能:

    前区号码遗漏评分

*/



function buildMissingMap(
    history
){


    const missing={};



    // 初始化1-35

    for(
        let i=1;
        i<=35;
        i++
    ){

        missing[i]=
        history.length;

    }




    // 从最新一期往前找

    for(
        let i=history.length-1;
        i>=0;
        i--
    ){


        history[i]
        .front
        .forEach(num=>{


            if(
                missing[num]
                ===
                history.length
            ){

                missing[num]
                =
                history.length-1-i;

            }


        });



    }



    return missing;


}







function scoreMissing(
    front,
    history
){


    const missingMap =
    buildMissingMap(
        history
    );



    let total=0;



    front.forEach(num=>{


        const miss =
        missingMap[num];



        let score;



        /*
            遗漏过短:
            热度过高

            遗漏适中:
            加分

            遗漏过长:
            防止追冷

        */



        if(
            miss>=3 &&
            miss<=20
        ){

            score=100;

        }


        else if(
            miss<3
        ){

            score=70;

        }


        else{

            score=50;

        }



        total+=score;



    });





    return {


        score:

        Number(
            (
            total/5
            )
            .toFixed(2)
        ),



        missingMap

    };


}





module.exports =
scoreMissing;