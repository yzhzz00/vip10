// engine/rankingEngine.js


/*
    DLT-AI CORE

    Ranking Engine V1.0


    功能：

    AI评分结果

        ↓

    最终预测列表


*/



function getLevel(score){


    if(score>=90){

        return "★★★★★";

    }


    if(score>=80){

        return "★★★★";

    }


    if(score>=70){

        return "★★★";

    }


    return "★★";

}




function formatNumber(arr){


    return arr
    .map(
        n=>
        String(n)
        .padStart(2,"0")
    )
    .join(" ");

}





function buildReason(item){


    const reasons=[];



    if(
        item.scores.sum>=90
    ){

        reasons.push(
            "和值符合"
        );

    }



    if(
        item.scores.zone>=90
    ){

        reasons.push(
            "三区符合"
        );

    }



    if(
        item.scores.span>=90
    ){

        reasons.push(
            "跨度符合"
        );

    }



    if(
        item.scores.oddEven>=90
    ){

        reasons.push(
            "奇偶符合"
        );

    }



    return reasons;

}





function rankingEngine(
    results,
    limit=10
){


    return results

    .slice(
        0,
        limit
    )

    .map(
        (item,index)=>{


            return {


                rank:
                index+1,



                front:
                formatNumber(
                    item.front
                ),



                back:
                formatNumber(
                    item.back
                ),



                score:
                item.finalScore,



                level:
                getLevel(
                    item.finalScore
                ),



                reasons:
                buildReason(
                    item
                )

            };


        }

    );


}



module.exports =
rankingEngine;