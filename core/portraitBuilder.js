// core/portraitBuilder.js


/*
    DLT-AI CORE V1.1

    Portrait Builder

    功能:

    特征数据

        ↓

    开奖画像

*/






function average(
    arr
){


    if(
        arr.length===0
    ){

        return 0;

    }



    return (

        arr.reduce(
            (a,b)=>a+b,
            0
        )

        /

        arr.length

    );


}








function buildSumPortrait(
    features
){


    const sums =

    features.map(

        item=>

        item.frontSum

    );



    return {


        avg:

        Number(
            average(sums)
            .toFixed(2)
        ),



        recent:

        sums.slice(-20)



    };


}









function buildSpanPortrait(
    features
){



    const spans =

    features.map(

        item=>

        item.frontSpan

    );



    return {


        avg:

        Number(
            average(spans)
            .toFixed(2)
        ),



        recent:

        spans.slice(-20)


    };


}









function buildZonePortrait(
    features
){



    let z1=0;

    let z2=0;

    let z3=0;



    features.forEach(
        item=>{


            z1 +=

            item.frontZone.zone1;



            z2 +=

            item.frontZone.zone2;



            z3 +=

            item.frontZone.zone3;



        }
    );




    const total =

    z1+z2+z3;




    return {


        zone1:

        Number(
            (z1/total)
            .toFixed(3)
        ),



        zone2:

        Number(
            (z2/total)
            .toFixed(3)
        ),



        zone3:

        Number(
            (z3/total)
            .toFixed(3)
        )


    };


}









function buildOddEvenPortrait(
    features
){



    let odd=0;

    let even=0;



    features.forEach(
        item=>{


            odd +=

            item.frontOddEven.odd;



            even +=

            item.frontOddEven.even;


        }
    );




    const total=

    odd+even;



    return {


        odd:

        Number(
            (odd/total)
            .toFixed(3)
        ),



        even:

        Number(
            (even/total)
            .toFixed(3)
        )


    };

}









function portraitBuilder(
    features
){



    return {


        count:

        features.length,



        sum:

        buildSumPortrait(
            features
        ),



        span:

        buildSpanPortrait(
            features
        ),



        zone:

        buildZonePortrait(
            features
        ),



        oddEven:

        buildOddEvenPortrait(
            features
        )


    };


}







module.exports =
portraitBuilder;