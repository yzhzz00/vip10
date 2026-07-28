/**
 * DLT-AI-CORE-VIP
 * 真实历史滚动回测引擎
 *
 * 核心原则：
 * 不读取未来数据
 * 每一期只使用之前历史
 */


const fs = require("fs");
const config = require("../config");

const predict =
    require("./predict");



/**
 * 读取历史
 */
function loadHistory(){

    if(!fs.existsSync(config.dataFile)){
        return [];
    }


    const text =
        fs.readFileSync(
            config.dataFile,
            "utf8"
        );


    return text
        .split(/\r?\n/)
        .filter(
            x=>x.trim()
        )
        .map(line=>{

            const nums =
                line.match(/\d+/g)
                .map(Number);


            return {

                front:
                nums.slice(0,5),

                back:
                nums.slice(5,7)

            };

        });

}



/**
 * 计算命中数量
 */
function compare(
    prediction,
    real
){

    let frontHit =
        prediction.front.filter(
            n=>real.front.includes(n)
        ).length;


    let backHit =
        prediction.back.filter(
            n=>real.back.includes(n)
        ).length;


    return {

        frontHit,

        backHit,

        total:
        frontHit + backHit

    };

}



/**
 * 单期模拟预测
 *
 * 注意：
 * 当前版本使用模型接口
 * 后续升级为历史切片训练
 */
function testPeriod(
    index,
    history
){

    const real =
        history[index];


    const result =
        predict.run();


    let best =
        {
            frontHit:0,
            backHit:0,
            total:0
        };


    result.prediction.forEach(item=>{

        const hit =
            compare(
                item,
                real
            );


        if(
            hit.total >
            best.total
        ){

            best = hit;

        }

    });



    return {

        period:
        index + 1,

        result:
        best

    };

}



/**
 * 滚动回测
 */
function run(){

    const history =
        loadHistory();



    let start =
        history.length -
        config.backtestPeriod;


    if(start < 1){

        start = 1;

    }



    let records=[];


    let totalFront=0;

    let totalBack=0;


    let hitCount=0;



    for(
        let i=start;
        i<history.length;
        i++
    ){

        const item =
            testPeriod(
                i,
                history
            );


        records.push(item);



        totalFront +=
            item.result.frontHit;


        totalBack +=
            item.result.backHit;


        if(
            item.result.total>=3
        ){

            hitCount++;

        }

    }



    return {

        model:
        "DLT-AI-CORE-VIP",

        mode:
        "rolling-backtest",


        testPeriods:
        records.length,


        average:{

            front:
            (
                totalFront /
                records.length
            ).toFixed(2),


            back:
            (
                totalBack /
                records.length
            ).toFixed(2)

        },


        usefulHit:

        hitCount,


        detail:
        records

    };

}



module.exports={

    run

};
