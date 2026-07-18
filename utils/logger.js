/**
 * DLT-AI-CORE VIP
 * 日志系统
 */


import fs from "fs";


const LOG_FILE =
"./data/system.log";



function write(
    level,
    message
){


    const time =
    new Date()
    .toISOString();


    const text =
    `[${time}] [${level}] ${message}\n`;



    console.log(
        text.trim()
    );



    try{

        fs.appendFileSync(
            LOG_FILE,
            text,
            "utf8"
        );


    }catch(error){


    }


}




export function info(
    message
){

    write(
        "INFO",
        message
    );

}



export function warn(
    message
){

    write(
        "WARN",
        message
    );

}



export function error(
    message
){

    write(
        "ERROR",
        message
    );

}



export default {

    info,

    warn,

    error

};