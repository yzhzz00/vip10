// portrait/portraitMatcher.js


/*
    DLT-AI CORE V1.0

    Portrait Matcher

    功能:

    当前预测画像

        ↓

    历史相似开奖匹配

*/



// 单项距离评分

function rangeScore(
    value,
    min,
    max
){


    if(
        value>=min &&
        value<=max
    ){

        return 100;

    }


    const distance =
    Math.min(
        Math.abs(value-min),
        Math.abs(value-max)
    );


    return Math.max(
        0,
        100-distance*10
    );


}





function matchPortrait(
    history,
    prediction
){



    const results=[];



    history.forEach(item=>{


        const p =
        item.portrait;



        let score=0;



        // 和值

        score +=

        rangeScore(

            p.sum,

            prediction.sum.min,

            prediction.sum.max

        )
        *
        0.35;





        // 跨度

        score +=

        rangeScore(

            p.span,

            prediction.span.min,

            prediction.span.max

        )
        *
        0.25;







        // 三区

        if(
            p.zone
            ===
            prediction.zone
        ){

            score+=25;

        }







        // 奇偶

        if(
            p.oddEven
            ===
            prediction.oddEven
        ){

            score+=15;

        }







        results.push({


            issue:
            item.issue,


            date:
            item.date,


            front:
            item.front,


            back:
            item.back,



            score:
            Number(
                score.toFixed(2)
            ),



            portrait:p


        });



    });





    // 高分优先

    results.sort(
        (a,b)=>
        b.score-a.score
    );



    return results.slice(
        0,
        20
    );


}





module.exports =
matchPortrait;