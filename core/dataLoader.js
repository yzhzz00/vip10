// core/dataLoader.js


/*
    DLT-AI CORE V1.0

    Data Loader

    功能:
    读取大乐透历史数据

*/


const fs = require("fs");
const path = require("path");



function dataLoader(){


    const filePath =
    path.join(
        __dirname,
        "../data/dlt_history.txt"
    );



    if(
        !fs.existsSync(filePath)
    ){

        throw new Error(
            "找不到大乐透历史数据文件: "
            +
            filePath
        );

    }



    const text =
    fs.readFileSync(
        filePath,
        "utf8"
    );



    const lines =
    text
    .split(/\r?\n/)
    .filter(
        line =>
        line.trim()!==""
    );



    const history =
    [];



    lines.forEach(
        line=>{


            const parts =
            line.split("|");



            if(
                parts.length!==4
            ){

                return;

            }



            const issue =
            parts[0].trim();



            const date =
            parts[1].trim();



            const front =
            parts[2]
            .trim()
            .split(" ")
            .map(
                Number
            );



            const back =
            parts[3]
            .trim()
            .split(" ")
            .map(
                Number
            );



            history.push({

                issue,

                date,

                front,

                back

            });



        }
    );



    return history;


}



module.exports =
dataLoader;