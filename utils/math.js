/**
 * DLT-AI-CORE VIP
 * 数学基础工具
 */


/**
 * 求和
 */
export function sum(arr = []) {

    return arr.reduce(
        (a,b)=>a+b,
        0
    );

}


/**
 * 平均值
 */
export function average(arr = []) {

    if(!arr.length){
        return 0;
    }

    return sum(arr) / arr.length;

}



/**
 * 最大值
 */
export function max(arr=[]){

    return Math.max(...arr);

}



/**
 * 最小值
 */
export function min(arr=[]){

    return Math.min(...arr);

}



/**
 * 方差
 */
export function variance(arr=[]){

    if(!arr.length){
        return 0;
    }


    const avg =
    average(arr);


    return average(
        arr.map(
            x=>(x-avg)**2
        )
    );

}



/**
 * 标准差
 */
export function standardDeviation(arr=[]){

    return Math.sqrt(
        variance(arr)
    );

}



/**
 * 归一化
 */
export function normalize(value,minValue,maxValue){

    if(maxValue===minValue){
        return 0;
    }


    return (
        value-minValue
    )
    /
    (
        maxValue-minValue
    );

}



/**
 * 限制范围
 */
export function clamp(
    value,
    minValue,
    maxValue
){

    return Math.max(
        minValue,
        Math.min(
            value,
            maxValue
        )
    );

}



/**
 * 随机整数
 */
export function randomInt(
    min,
    max
){

    return Math.floor(
        Math.random()
        *
        (
            max-min+1
        )
    )
    +
    min;

}



/**
 * 随机抽样
 */
export function randomChoice(arr=[]){

    if(!arr.length){
        return null;
    }


    return arr[
        randomInt(
            0,
            arr.length-1
        )
    ];

}



/**
 * 排序评分
 */
export function sortByScore(
    list=[]
){

    return list.sort(
        (a,b)=>
        b.score-a.score
    );

}



/**
 * 组合数量计算
 */
export function combination(
    n,
    r
){

    if(r>n){
        return 0;
    }


    let result=1;


    for(
        let i=1;
        i<=r;
        i++
    ){

        result =
        result*
        (n-r+i)
        /
        i;

    }


    return result;

}