// app.js


/*
    DLT-AI CORE

    Main Controller V1.0


*/



const dataLoader =
require("./core/dataLoader");


const portraitBuilder =
require("./core/portraitBuilder");


const portraitPredictor =
require("./portrait/portraitPredictor");


const candidateGenerator =
require("./engine/candidateGenerator");


const decisionEngine =
require("./engine/decisionEngine");


const rankingEngine =
require("./engine/rankingEngine");






function runAI(){



    console.log(
        "===== DLT-AI CORE START ====="
    );



    // 1.读取历史数据

    const history =
    dataLoader();



    console.log(
        "历史数据:",
        history.length,
        "期"
    );





    // 2.生成开奖画像


    const portraits =
    portraitBuilder(
        history
    );



    console.log(
        "画像生成完成:",
        portraits.length
    );





    // 3.预测下一期画像


    const portraitPrediction =
    portraitPredictor(
        portraits
    );



    console.log(
        "预测画像:"
    );


    console.log(
        portraitPrediction
    );







    // 4.生成候选号码


    const candidates =
    candidateGenerator(

        portraitPrediction.prediction,

        5000

    );



    console.log(
        "候选数量:",
        candidates.length
    );







    // 5.AI评分


    const scored =
    decisionEngine(

        candidates,

        portraitPrediction.prediction

    );



    console.log(
        "评分完成"
    );







    // 6.TOP结果


    const result =
    rankingEngine(

        scored,

        10

    );



    console.log(
        "===== TOP10 ====="
    );



    console.table(
        result
    );



    return {


        prediction:
        portraitPrediction,


        result


    };

}




// 导出

module.exports =
runAI;





// 如果直接运行

if(
    require.main
    ===
    module
){

    runAI();

}