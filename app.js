/*
    DLT-AI CORE

    Version:
    V1.0.0

    Main Controller

*/



const dataLoader =
require("./core/dataLoader");


const featureBuilder =
require("./core/featureBuilder");


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



    // 1.读取历史数据

    const history =

    dataLoader();





    // 2.生成特征


    const features =

    featureBuilder(
        history
    );





    // 3.生成画像


    const portrait =

    portraitBuilder(
        features
    );





    // 4.预测结构


    const prediction =

    portraitPredictor(
        portrait
    );






    // 5.生成候选


    const candidates =

    candidateGenerator(

        prediction.prediction,

        5000

    );







    // 6.综合评分


    const scored =

    decisionEngine(

        candidates,

        prediction.prediction,

        history

    );







    // 7.排名TOP10


    const ranking =

    rankingEngine(

        scored,

        10

    );







    return {


        version:

        "V1.0.0",



        prediction,



        ranking


    };



}






module.exports =
runAI;