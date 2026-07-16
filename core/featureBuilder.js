// core/featureBuilder.js


/*
    DLT-AI CORE V1.1

    Feature Builder

    功能:

    历史开奖

        ↓

    AI特征数据

*/





function sum(numbers){


    return numbers.reduce(

        (a,b)=>a+b,

        0

    );

}







function span(numbers){


    return Math.max(...numbers)

    -

    Math.min(...numbers);


}







function getOddEven(numbers){



    let odd=0;

    let even=0;



    numbers.forEach(num=>{


        if(num%2===0){

            even++;

        }

        else{

            odd++;

        }


    });



    return {

        odd,

        even

    };


}









function getZone(numbers){



    let zone1=0;

    let zone2=0;

    let zone3=0;



    numbers.forEach(num=>{


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




    return {


        zone1,

        zone2,

        zone3


    };


}









function buildFeature(item){



    return {


        issue:item.issue,


        date:item.date,



        front:item.front,


        back:item.back,





        frontSum:

        sum(
            item.front
        ),




        frontSpan:

        span(
            item.front
        ),





        frontOddEven:

        getOddEven(
            item.front
        ),




        frontZone:

        getZone(
            item.front
        ),





        backSum:

        sum(
            item.back
        ),





        backSpan:

        span(
            item.back
        )



    };


}









function featureBuilder(
    history
){



    return history.map(

        item=>

        buildFeature(item)

    );



}








module.exports =
featureBuilder;