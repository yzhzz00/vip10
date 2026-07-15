// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// data_parser.js
// 大乐透历史数据解析模块
// ==================================================

"use strict";


window.V100Parser = {




    // ==========================
    // 解析单行
    // ==========================


    parseLine(line){



        if(
            !line
            ||
            line.trim()===""
        ){

            return null;

        }




        // 去除多余空格

        let arr=

        line.trim()

        .split(/\s+/);





        /*
        
        格式:

        期号
        日期
        前区5个
        后区2个

        */




        if(
            arr.length < 9
        ){

            return null;

        }






        let period=

        arr[0];




        let date=

        arr[1];






        let front=

        arr.slice(

            2,

            7

        )

        .map(

            Number

        );






        let back=

        arr.slice(

            7,

            9

        )

        .map(

            Number

        );









        return {



            period,


            date,


            front,


            back



        };



    },









    // ==========================
    // 解析完整TXT
    // ==========================


    parseText(text){



        let lines=

        text.split(/\r?\n/);





        let result=[];





        lines.forEach(line=>{



            let item=

            this.parseLine(

                line

            );





            if(item){


                result.push(

                    item

                );


            }



        });






        return result;



    },









    // ==========================
    // 文件读取
    // ==========================


    loadFile(file){



        return new Promise(

            resolve=>{



                let reader=

                new FileReader();





                reader.onload=function(e){



                    let data=

                    V100Parser.parseText(

                        e.target.result

                    );



                    resolve(data);



                };





                reader.readAsText(

                    file,

                    "utf-8"

                );



            }

        );



    }






};