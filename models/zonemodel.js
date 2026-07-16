// models/zoneModel.js


/*
    三区结构评分模型
*/



function getZone(numbers){


    let z1=0;

    let z2=0;

    let z3=0;



    numbers.forEach(
        n=>{


            if(n<=12){

                z1++;

            }
            else if(n<=24){

                z2++;

            }
            else{

                z3++;

            }


        }
    );



    return `${z1}-${z2}-${z3}`;


}








function zoneModel(
    numbers,
    target
){


    const zone =

    getZone(numbers);



    let score;



    if(
        zone===target
    ){

        score=100;

    }
    else{


        score=60;


    }



    return {


        zone,


        score


    };


}







module.exports =
zoneModel;