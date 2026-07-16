// core/dataLoader.js


/*
    DLT-AI CORE V1.1

    Data Loader

    功能:

    读取大乐透历史数据

*/


const fs = require("fs");

const path = require("path");






function parseLine(line){


    const arr =

    line
    .trim()
    .split(/\s+/);



    // 数据不足跳过

    if(
        arr.length < 9
    ){

        return null;

    }





    return {


        issue:

        arr[0],



        date:

        arr[1],



        front:


        arr
        .slice(2,7)
        .map(Number),



        back:


        arr
        .slice(7,9)
        .map(Number)



    };


}









function dataLoader(){



    const file =


    path.join(

        __dirname,

        "../data/dlt_history.txt"

    );





    const text =


    fs.readFileSync(

        file,

        "utf8"

    );






    const history=[];





    text

    .split("\n")

    .forEach(

        line=>{


            const item =

            parseLine(line);



            if(item){

                history.push(item);

            }


        }

    );






    return history;



}







module.exports =
dataLoader;