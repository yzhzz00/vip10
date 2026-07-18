// 数组去重

function unique(arr){

    return [
        ...new Set(arr)
    ];

}



// 数组排序（从高到低）

function sortDesc(arr){

    return arr.sort(
        (a,b)=>b-a
    );

}



// 数组求和

function sum(arr){

    return arr.reduce(
        (a,b)=>a+b,
        0
    );

}



// 平均值

function average(arr){

    if(!arr.length){

        return 0;

    }


    return sum(arr)/arr.length;

}



// 随机抽取

function sample(arr,count){


    const temp=[...arr];

    const result=[];



    while(
        result.length<count
        &&
        temp.length>0
    ){


        const index=

        Math.floor(
            Math.random()
            *
            temp.length
        );


        result.push(
            temp[index]
        );


        temp.splice(
            index,
            1
        );


    }



    return result;

}



// 生成数字范围

function range(
start,
end
){


    const result=[];


    for(
        let i=start;
        i<=end;
        i++
    ){

        result.push(i);

    }


    return result;

}



// 保留小数

function round(
number,
digits=2
){


    return Number(

        number.toFixed(digits)

    );


}



// 当前时间

function now(){

    return new Date()
    .toISOString();

}



export {

unique,

sortDesc,

sum,

average,

sample,

range,

round,

now

};