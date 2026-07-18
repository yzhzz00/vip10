/**
 * DLT-AI-CORE VIP
 * 统计分析工具
 *
 * 支持：
 * 频率
 * 热冷号
 * 遗漏
 * 奇偶
 * 大小
 * 三区
 * 和值
 * 跨度
 * AC值
 */


import {
    average
} from "./math.js";



/**
 * 数字频率统计
 */
export function frequency(numbers = []) {


    const map = {};


    numbers.forEach(
        n=>{

            map[n] =
            (map[n] || 0) + 1;

        }
    );


    return map;

}




/**
 * 排序频率
 */
export function sortFrequency(map={}){


    return Object.entries(map)

    .map(
        ([number,count])=>({

            number:Number(number),

            count

        })
    )

    .sort(
        (a,b)=>
        b.count-a.count
    );


}



/**
 * 热号TOP
 */
export function hotNumbers(
    numbers=[],
    top=10
){

    return sortFrequency(
        frequency(numbers)
    )
    .slice(0,top);

}



/**
 * 冷号TOP
 */
export function coldNumbers(
    numbers=[],
    top=10
){


    const result=[];


    for(
        let i=1;
        i<=35;
        i++
    ){

        result.push({

            number:i,

            count:
            numbers.filter(
                n=>n===i
            ).length

        });

    }


    return result
    .sort(
        (a,b)=>
        a.count-b.count
    )
    .slice(0,top);


}





/**
 * 遗漏计算
 *
 * 最近一期向前计算
 */
export function omission(
    history=[],
    maxNumber=35
){


    const result={};


    for(
        let n=1;
        n<=maxNumber;
        n++
    ){

        result[n]=0;


        for(
            let i=history.length-1;
            i>=0;
            i--
        ){

            if(
                history[i]
                .includes(n)
            ){

                break;

            }


            result[n]++;

        }


    }


    return result;

}





/**
 * 奇偶比例
 */
export function oddEven(
    numbers=[]
){


    let odd=0;

    let even=0;


    numbers.forEach(
        n=>{

            if(n%2){

                odd++;

            }else{

                even++;

            }

        }
    );


    return {

        odd,

        even,

        ratio:
        `${odd}:${even}`

    };


}





/**
 * 大小比例
 *
 * 大乐透前区：
 * 1-17 小
 * 18-35 大
 */
export function bigSmall(
    numbers=[]
){


    let small=0;

    let big=0;


    numbers.forEach(
        n=>{


            if(n<=17){

                small++;

            }else{

                big++;

            }


        }
    );


    return {

        small,

        big,

        ratio:
        `${small}:${big}`

    };


}




/**
 * 三区统计
 *
 * 01-12
 * 13-24
 * 25-35
 */
export function zones(
    numbers=[]
){


    const zone={

        zone1:0,

        zone2:0,

        zone3:0

    };


    numbers.forEach(
        n=>{


            if(n<=12){

                zone.zone1++;

            }

            else if(n<=24){

                zone.zone2++;

            }

            else{

                zone.zone3++;

            }


        }
    );


    return zone;


}





/**
 * 和值
 */
export function sumValue(
    numbers=[]
){

    return numbers.reduce(
        (a,b)=>a+b,
        0
    );

}




/**
 * 跨度
 */
export function span(
    numbers=[]
){

    if(!numbers.length){

        return 0;

    }


    return Math.max(...numbers)
    -
    Math.min(...numbers);

}





/**
 * AC值
 *
 * 大乐透常用：
 * 不同差值数量-去重
 */
export function acValue(
    numbers=[]
){


    const diffs=new Set();


    for(
        let i=0;
        i<numbers.length;
        i++
    ){

        for(
            let j=i+1;
            j<numbers.length;
            j++
        ){

            diffs.add(
                Math.abs(
                    numbers[i]
                    -
                    numbers[j]
                )
            );

        }

    }


    return (
        diffs.size
        -
        (numbers.length-1)
    );


}





/**
 * 连号数量
 */
export function consecutiveCount(
    numbers=[]
){

    let count=0;


    const arr =
    [...numbers]
    .sort(
        (a,b)=>a-b
    );


    for(
        let i=1;
        i<arr.length;
        i++
    ){

        if(
            arr[i]-arr[i-1]===1
        ){

            count++;

        }

    }


    return count;


}





/**
 * 综合特征
 */
export function buildStatistics(
    front=[]
){


    return {


        oddEven:
        oddEven(front),


        bigSmall:
        bigSmall(front),


        zones:
        zones(front),


        sum:
        sumValue(front),


        span:
        span(front),


        ac:
        acValue(front),


        consecutive:
        consecutiveCount(front)


    };


}