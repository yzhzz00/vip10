import fs from "fs";


import config from "../config.js";


function readFile(path){

    try{

        return fs.readFileSync(
            path,
            "utf-8"
        );

    }catch(e){

        console.log(
            "数据读取失败:",
            path
        );

        return "";

    }

}



function loadDLT(){


    const text =
    readFile(config.data.dlt);


    return text
    .split(/\r?\n/)
    .filter(
        x=>x.trim().length>0
    );


}



function loadPL5(){


    const text =
    readFile(config.data.pl5);


    return text
    .split(/\r?\n/)
    .filter(
        x=>x.trim().length>0
    );


}



function loadData(type){


    if(type==="pl5"){

        return loadPL5();

    }


    return loadDLT();


}



export {

    loadData,

    loadDLT,

    loadPL5

};