// portrait/portraitPredictor.js


/*
    DLT-AI CORE V1.0

    Portrait Predictor

    历史画像

        ↓

    下一期结构预测

*/



// 平均值

function average(arr){


    return Math.round(

        arr.reduce(
            (a,b)=>a+b,
            0
        )
        /
        arr.length

    );


}



// 获取最高频结构

function mostCommon(arr){


    const map={};



    arr.forEach(item=>{


        if(!map[item]){

            map[item]=0;

        }


        map[item]++;


    });



    return Object.keys(map)
    .sort(
        (a,b)=>
        map[b]-map[a]
    )[0];


}





function predictPortrait(history){



    if(
        !history ||
        history.length===0
    ){

        throw new Error(
            "没有画像数据"
        );

    }



    // 最近100期权重

    const recent =

    history.slice(
        -100
    );





    // =====================
    // 和值预测
    // =====================


    const sums =

    recent.map(
        item=>
        item.features.sum
    );



    const avgSum =
    average(sums);



    const sumPrediction={


        min:
        avgSum-8,


        max:
        avgSum+8,


        center:
        avgSum

    };







    // =====================
    // 跨度预测
    // =====================


    const spans =

    recent.map(
        item=>
        item.features.span
    );



    const avgSpan =
    average(spans);



    const spanPrediction={


        min:
        avgSpan-5,


        max:
        avgSpan+5,


        center:
        avgSpan


    };







    // =====================
    // 三区预测
    // =====================


    const zones =

    recent.map(
        item=>
        item.features.zone
    );



    const zonePrediction =

    mostCommon(
        zones
    );







    // =====================
    // 奇偶预测
    // =====================


    const oddEven =

    recent.map(
        item=>
        item.features.oddEven
    );



    const oddEvenPrediction =

    mostCommon(
        oddEven
    );







    // =====================
    // 后区和值
    // =====================


    const backSums =

    recent.map(
        item=>
        item.features.backSum
    );



    const backAvg =

    average(
        backSums
    );







    return {


        sampleSize:
        recent.length,



        prediction:{


            sum:
            sumPrediction,



            span:
            spanPrediction,



            zone:
            zonePrediction,



            oddEven:
            oddEvenPrediction,



            backSum:
            {

                center:
                backAvg,

                min:
                backAvg-5,

                max:
                backAvg+5

            }


        }



    };


}





module.exports =
predictPortrait;