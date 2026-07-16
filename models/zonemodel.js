// models/zoneModel.js


/*
    DLT-AI CORE V1.0

    Zone Model

    功能:

    前区三区结构评分

*/



function calculateZone(front){


    let zone1=0;

    let zone2=0;

    let zone3=0;



    front.forEach(num=>{


        if(num<=12){

            zone1++;

        }

        else if(num<=24){

            zone2++;

        }

        else{

            zone3++;

        }


    });



    return `${zone1}-${zone2}-${zone3}`;

}





function scoreZone(
    front,
    prediction
){


    const zone =
    calculateZone(front);



    let score;



    if(
        zone
        ===
        prediction
    ){

        score=100;

    }

    else{


        const target =
        prediction
        .split("-")
        .map(Number);



        const current =
        zone
        .split("-")
        .map(Number);



        const diff =

        Math.abs(
            target[0]
            -
            current[0]
        )

        +

        Math.abs(
            target[1]
            -
            current[1]
        )

        +

        Math.abs(
            target[2]
            -
            current[2]
        );



        score =
        Math.max(
            0,
            100-diff*20
        );


    }




    return {


        value:
        zone,


        score:
        score


    };


}





module.exports =
scoreZone;