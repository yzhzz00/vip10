/**
 * DLT-AI-CORE-VIP
 * 预测引擎
 *
 * 功能：
 * 1. 调用历史分析数据
 * 2. 号码评分
 * 3. 候选池筛选
 * 4. 生成预测组合
 */


const engine = require("./engine");



/**
 * 数字评分
 *
 * 综合：
 * 频率 + 遗漏 + 随机扰动
 */
function scoreNumber(
    number,
    count,
    missing
){

    let score = 0;


    // 出现频率
    score += count[number] * 0.6;


    // 遗漏周期
    score += missing[number] * 0.3;


    // 小幅随机扰动
    score += Math.random() * 10;


    return score;

}



/**
 * 排序获取候选号码
 */
function getCandidates(
    count,
    missing,
    max
){

    let list=[];


    for(
        let i=1;
        i<=max;
        i++
    ){

        list.push({

            number:i,

            score:
            scoreNumber(
                i,
                count,
                missing
            )

        });

    }


    return list
        .sort(
            (a,b)=>
            b.score-a.score
        )
        .map(
            item=>item.number
        );

}



/**
 * 组合生成
 */
function createCombination(){

    const data =
        engine.analyze();



    const frontPool =
        getCandidates(
            data.front,
            data.missing.front,
            35
        );


    const backPool =
        getCandidates(
            data.back,
            data.missing.back,
            12
        );



    // 前区取评分靠前号码
    let front =
        frontPool
        .slice(0,12)
        .sort(
            ()=>Math.random()-0.5
        )
        .slice(0,5);



    // 后区取评分靠前号码
    let back =
        backPool
        .slice(0,6)
        .sort(
            ()=>Math.random()-0.5
        )
        .slice(0,2);



    return {

        front:
        front
        .sort(
            (a,b)=>a-b
        ),

        back:
        back
        .sort(
            (a,b)=>a-b
        )

    };

}



/**
 * 主预测接口
 */
function run(){

    const result=[];


    for(
        let i=0;
        i<5;
        i++
    ){

        result.push(
            createCombination()
        );

    }


    return {

        model:
        "DLT-AI-CORE-VIP",

        type:
        "rolling-analysis",

        prediction:
        result

    };

}



module.exports={

    run

};
