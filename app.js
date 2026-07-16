// app.js


/*
    DLT-AI CORE V1.0

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



const portraitMatcher =
require("./portrait/portraitMatcher");



const candidateGenerator =
require("./engine/candidateGenerator");



const decisionEngine =
require("./engine/decisionEngine");



const rankingEngine =
require("./engine/rankingEngine");








function runAI(){



    console.log(
        "===== DLT-AI CORE V1.0 ====="
    );





    // 1.读取数据


    const history =

    dataLoader();



    console.log(

        "历史数据:",

        history.length,

        "期"

    );








    // 2.特征计算


    const features =

    featureBuilder(
        history
    );








    // 3.生成画像


    const portraits =

    portraitBuilder(
        features
    );








    // 4.预测下一期结构


    const prediction =

    portraitPredictor(
        portraits
    );




    console.log(

        "预测结构:",

        prediction.prediction

    );









    // 5.历史相似分析


    const similar =

    portraitMatcher(

        portraits,

        prediction.prediction

    );









    // 6.生成候选


    const candidates =

    candidateGenerator(

        prediction.prediction,

        5000

    );



    console.log(

        "候选数量:",

        candidates.length

    );









    // 7.综合评分


    const scored =

    decisionEngine(

        candidates,

        prediction.prediction,

        history

    );









    // 8.TOP输出


    const ranking =

    rankingEngine(

        scored,

        10

    );






    console.log(
        "===== TOP10 ====="
    );



    console.table(
        ranking
    );







    return {


        prediction,


        similar,


        ranking


    };



}









module.exports =
runAI;







// 直接运行

if(
    require.main
    ===
    module
){

    runAI();

}