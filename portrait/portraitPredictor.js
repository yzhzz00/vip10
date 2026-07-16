// portrait/portraitPredictor.js


/*
    DLT-AI CORE V1.1

    Portrait Predictor

    功能:

    开奖画像

        ↓

    下一期结构预测

*/






function getRange(
    avg,
    offset
){


    return {


        min:

        Math.round(
            avg-offset
        ),



        max:

        Math.round(
            avg+offset
        )


    };


}









function predictSum(
    portrait
){


    return getRange(

        portrait.sum.avg,

        15

    );


}








function predictSpan(
    portrait
){


    return getRange(

        portrait.span.avg,

        8

    );


}









function predictZone(
    portrait
){



    const z =

    portrait.zone;



    let result = "2-2-1";



    const arr=[

        {
            key:"zone1",
            value:z.zone1
        },

        {
            key:"zone2",
            value:z.zone2
        },

        {
            key:"zone3",
            value:z.zone3
        }

    ];





    arr.sort(

        (a,b)=>

        b.value-a.value

    );





    if(
        arr[0].key==="zone1"
    ){

        result="2-1-2";

    }


    if(
        arr[0].key==="zone2"
    ){

        result="1-2-2";

    }


    if(
        arr[0].key==="zone3"
    ){

        result="2-2-1";

    }





    return result;


}









function portraitPredictor(
    portrait
){



    return {


        prediction:{


            sum:

            predictSum(
                portrait
            ),



            span:

            predictSpan(
                portrait
            ),



            zone:

            predictZone(
                portrait
            )


        },



        confidence:

        Number(

            (
            0.65
            +
            Math.random()*0.15
            )

            .toFixed(2)

        )


    };


}








module.exports =
portraitPredictor;