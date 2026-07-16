// research/backtest.js


/*
    DLT-AI CORE V1.0

    Backtest Engine

    功能:

    历史模拟测试

*/



const portraitPredictor =
require("../portrait/portraitPredictor");


const candidateGenerator =
require("../engine/candidateGenerator");


const decisionEngine =
require("../engine/decisionEngine");


const rankingEngine =
require("../engine/rankingEngine");









function hitCount(
    predict,
    actual
){


    return predict.filter(
        n =>
        actual.includes(n)
    )
    .length;


}









function backtest(
    history
){



    const records=[];



    /*
        从第100期开始

        保留前面数据训练

    */



    for(
        let i=100;
        i<history.length;
        i++
    ){



        const train =

        history.slice(
            0,
            i
        );



        const actual =

        history[i];






        // 生成画像预测


        const prediction =

        portraitPredictor(
            train
        );






        // 生成候选


        const candidates =

        candidateGenerator(
            prediction.prediction,
            5000
        );






        // 评分


        const scored =

        decisionEngine(
            candidates,
            prediction.prediction,
            train
        );






        // TOP10


        const top10 =

        rankingEngine(
            scored,
            10
        );







        let bestFront=0;

        let bestBack=0;






        top10.forEach(
            item=>{


                const frontHit =

                hitCount(
                    item.front,
                    actual.front
                );



                const backHit =

                hitCount(
                    item.back,
                    actual.back
                );




                if(
                    frontHit>bestFront
                ){

                    bestFront=
                    frontHit;

                }


                if(
                    backHit>bestBack
                ){

                    bestBack=
                    backHit;

                }


            }
        );







        records.push({


            issue:
            actual.issue,


            frontHit:
            bestFront,


            backHit:
            bestBack



        });



    }





    return records;


}







module.exports =
backtest;