// portrait/portraitMatcher.js


/*
    DLT-AI CORE V1.1

    Portrait Matcher

    功能:

    当前走势

        ↓

    历史相似走势

*/







function compareValue(
    a,
    b
){


    return Math.abs(
        a-b
    );


}









function compareZone(
    a,
    b
){


    return a===b
    ?
    1
    :
    0;


}









function calculateSimilarity(
    current,
    historyItem
){



    let score=100;



    // 和值差异


    score -=

    compareValue(

        current.sum.avg,

        historyItem.frontSum

    )
    *
    0.8;





    // 跨度差异


    score -=

    compareValue(

        current.span.avg,

        historyItem.frontSpan

    )
    *
    1.2;






    // 三区


    const zoneScore =

    compareZone(

        current.zone,

        `${historyItem.frontZone.zone1}-${
        historyItem.frontZone.zone2
        }-${
        historyItem.frontZone.zone3
        }`

    );




    if(
        zoneScore===0
    ){

        score-=15;

    }






    if(score<0){

        score=0;

    }




    return Number(
        score.toFixed(2)
    );


}









function portraitMatcher(
    portrait,
    features
){



    const result=[];



    features.forEach(
        item=>{


            const similarity =

            calculateSimilarity(

                portrait,

                item

            );



            result.push({


                issue:item.issue,


                similarity,



                front:item.front,


                back:item.back



            });



        }
    );





    return result

    .sort(

        (a,b)=>

        b.similarity
        -
        a.similarity

    )

    .slice(
        0,
        20
    );



}







module.exports =
portraitMatcher;