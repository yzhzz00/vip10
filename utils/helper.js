/**
 * DLT-AI-CORE VIP
 * 通用辅助工具
 */


import fs from "fs";
import path from "path";



/**
 * 判断文件是否存在
 */
export function fileExists(
    filePath
){

    return fs.existsSync(
        filePath
    );

}




/**
 * 安全读取JSON
 */
export function readJSON(
    filePath,
    defaultValue={}
){

    try{


        if(
            !fileExists(filePath)
        ){

            return defaultValue;

        }


        const data =
        fs.readFileSync(
            filePath,
            "utf8"
        );


        if(!data.trim()){

            return defaultValue;

        }


        return JSON.parse(data);



    }catch(error){


        return defaultValue;


    }

}




/**
 * 保存JSON
 */
export function saveJSON(
    filePath,
    data
){

    try{


        const dir =
        path.dirname(filePath);



        if(
            !fs.existsSync(dir)
        ){

            fs.mkdirSync(
                dir,
                {
                    recursive:true
                }
            );

        }



        fs.writeFileSync(
            filePath,
            JSON.stringify(
                data,
                null,
                2
            ),
            "utf8"
        );


        return true;



    }catch(error){


        console.error(
            error
        );


        return false;


    }

}




/**
 * 深复制
 */
export function deepClone(
    obj
){

    return JSON.parse(
        JSON.stringify(obj)
    );

}




/**
 * 随机打乱数组
 */
export function shuffle(
    array=[]
){

    const arr =
    [
        ...array
    ];


    for(
        let i=arr.length-1;
        i>0;
        i--
    ){

        const j =
        Math.floor(
            Math.random()
            *
            (i+1)
        );


        [
            arr[i],
            arr[j]
        ]
        =
        [
            arr[j],
            arr[i]
        ];

    }


    return arr;

}




/**
 * 去重
 */
export function unique(
    array=[]
){

    return [
        ...new Set(array)
    ];

}




/**
 * 延迟
 */
export function sleep(
    ms
){

    return new Promise(
        resolve=>
        setTimeout(
            resolve,
            ms
        )
    );

}




/**
 * 日期格式化
 */
export function now(){

    return new Date()
    .toISOString();

}




/**
 * 安全数字转换
 */
export function toNumber(
    value,
    defaultValue=0
){

    const num =
    Number(value);


    return Number.isNaN(num)
    ?
    defaultValue
    :
    num;

}




/**
 * 排序号码
 */
export function sortNumbers(
    numbers=[]
){

    return [
        ...numbers
    ]
    .sort(
        (a,b)=>a-b
    );

}