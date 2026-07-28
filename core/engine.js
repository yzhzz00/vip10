/**
 * DLT-AI-CORE-VIP
 * 核心计算引擎
 *
 * 功能：
 * 1. 读取历史开奖
 * 2. 号码统计
 * 3. 冷热分析
 * 4. 遗漏分析
 * 5. 基础综合评分
 */


const fs = require("fs");
const config = require("../config");


/**
 * 读取历史数据
 *
 * 格式:
 * 01 05 12 20 33 + 03 11
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


    const lines =
        text
        .split(/\r?\n/)
        .filter(
            item=>item.trim()
        );


    return lines.map(line=>{

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
 * 前区号码统计
 */
function countFront(history){

    const count={};


    for(let i=1;i<=35;i++){

        count[i]=0;

    }


    history.forEach(item=>{

        item.front.forEach(n=>{

            count[n]++;

        });

    });


    return count;

}



/**
 * 后区号码统计
 */
function countBack(history){

    const count={};


    for(let i=1;i<=12;i++){

        count[i]=0;

    }


    history.forEach(item=>{

        item.back.forEach(n=>{

            count[n]++;

        });

    });


    return count;

}



/**
 * 遗漏计算
 */
function calcMissing(history,type,max){

    const result={};


    for(let n=1;n<=max;n++){

        result[n]=0;

    }


    for(let i=history.length-1;i>=0;i--){

        let nums =
            type==="front"
            ?
            history[i].front
            :
            history[i].back;


        nums.forEach(n=>{

            if(result[n]===0){

                result[n]=
                history.length-i-1;

            }

        });


    }


    return result;

}



/**
 * 综合分析
 */
function analyze(){

    const history =
        loadHistory();


    const front =
        countFront(history);


    const back =
        countBack(history);


    const frontMissing =
        calcMissing(
            history,
            "front",
            35
        );


    const backMissing =
        calcMissing(
            history,
            "back",
            12
        );



    return {

        total:
            history.length,


        front,

        back,

        missing:{
            front:frontMissing,
            back:backMissing
        }


    };

}



module.exports={

    loadHistory,

    analyze,

    countFront,

    countBack,

    calcMissing

};
