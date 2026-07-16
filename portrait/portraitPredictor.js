// portrait/portraitPredictor.js

/*
    DLT-AI CORE

    Portrait Predictor V1.0

    输入:
    历史开奖画像

    输出:
    下一期画像预测

*/


function predictPortrait(history){


    if(!history || history.length===0){

        throw new Error(
            "没有历史画像数据"
        );

    }



    // 最近多少期参与分析

    const recentCount =
        Math.min(
            100,
            history.length
        );


    const recent =
        history.slice(
            -recentCount
        );



    // =====================
    // 和值分析
    // =====================


    const sums =
        recent.map(
            item =>
            item.portrait.sum
        );


    const avgSum =
        Math.round(
            sums.reduce(
                (a,b)=>a+b,
                0
            )
            /
            sums.length
        );



    const sumRange={

        min:avgSum-8,

        max:avgSum+8

    };



    // =====================
    // 跨度分析
    // =====================


    const spans =
        recent.map(
            item =>
            item.portrait.span
        );


    const avgSpan =
        Math.round(

            spans.reduce(
                (a,b)=>a+b,
                0
            )
            /
            spans.length

        );



    const spanRange={

        min:avgSpan-5,

        max:avgSpan+5

    };



    // =====================
    // 三区统计
    // =====================


    const zoneCount={};



    recent.forEach(item=>{


        const zone =
        item.portrait.zone;


        if(!zoneCount[zone]){

            zoneCount[zone]=0;

        }


        zoneCount[zone]++;


    });



    const bestZone =
        Object.keys(zoneCount)
        .sort(
            (a,b)=>
            zoneCount[b]
            -
            zoneCount[a]
        )[0];



    // =====================
    // 奇偶
    // =====================


    const oddEvenCount={};



    recent.forEach(item=>{


        const oe =
        item.portrait.oddEven;


        if(!oddEvenCount[oe]){

            oddEvenCount[oe]=0;

        }


        oddEvenCount[oe]++;


    });



    const bestOddEven =
        Object.keys(oddEvenCount)
        .sort(
            (a,b)=>
            oddEvenCount[b]
            -
            oddEvenCount[a]
        )[0];



    // =====================
    // 输出画像预测
    // =====================


    return {


        sampleSize:
            recentCount,


        prediction:{


            sum:{

                range:sumRange,

                confidence:
                    0.65

            },


            span:{

                range:spanRange,

                confidence:
                    0.60

            },


            zone:{

                value:
                bestZone,

                confidence:
                0.70

            },


            oddEven:{

                value:
                bestOddEven,

                confidence:
                0.65

            }


        }


    };


}



module.exports =
predictPortrait;