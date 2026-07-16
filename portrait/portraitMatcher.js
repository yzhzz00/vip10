// portrait/portraitMatcher.js


/*
    DLT-AI CORE

    Portrait Matcher V1.0


    功能：

    预测画像

        ↓

    历史相似画像匹配


*/


function matchPortrait(
    history,
    target
){


    if(
        !history ||
        history.length===0
    ){

        throw new Error(
            "没有历史画像"
        );

    }



    const result=[];



    history.forEach(item=>{


        let score=0;



        const p =
        item.portrait;



        // =====================
        // 和值相似度
        // =====================


        if(
            target.sum.range.min
            <=
            p.sum
            &&
            p.sum
            <=
            target.sum.range.max
        ){

            score+=30;

        }



        // =====================
        // 跨度相似度
        // =====================


        if(
            target.span.range.min
            <=
            p.span
            &&
            p.span
            <=
            target.span.range.max
        ){

            score+=25;

        }



        // =====================
        // 三区匹配
        // =====================


        if(
            target.zone.value
            ===
            p.zone
        ){

            score+=25;

        }



        // =====================
        // 奇偶匹配
        // =====================


        if(
            target.oddEven.value
            ===
            p.oddEven
        ){

            score+=20;

        }



        result.push({


            issue:
            item.issue,


            score,


            front:
            item.front,


            back:
            item.back,


            portrait:
            p


        });



    });



    // 排序

    result.sort(
        (a,b)=>
        b.score-a.score
    );



    // 返回最相似10期

    return result.slice(
        0,
        10
    );


}



module.exports =
matchPortrait;