// DLT-AI-CORE V11 FINAL
// core/data.js
// 大乐透历史数据读取模块


import fs from "fs";
import config from "../config.js";



class DataManager {


    constructor(){


        this.file =

        config.data.file;



    }






    load(){


        try{


            if(
                !fs.existsSync(
                    this.file
                )
            ){


                console.log(
                    "History file not found"
                );


                return [];

            }





            const text =

            fs.readFileSync(

                this.file,

                "utf-8"

            );






            const lines =

            text

            .split(/\r?\n/)

            .filter(

                line =>

                line.trim().length>0

            );







            const history = [];






            for(
                const line of lines
            ){



                /*
                
                支持格式:

                07001  2007-05-30  22 24 29 31 35  04 11

                */



                const match =


                line.match(

                    /(\d{5})\s+(\d{4}-\d{2}-\d{2})\s+(.+)/

                );





                if(!match){


                    continue;


                }





                const parts =

                match[3]

                .trim()

                .split(/\s+/)

                .map(Number);






                if(
                    parts.length < 7
                ){


                    continue;


                }







                const front =


                parts.slice(

                    0,

                    5

                );






                const back =


                parts.slice(

                    5,

                    7

                );







                // 数据校验


                if(

                    front.length===5

                    &&

                    back.length===2

                    &&

                    front.every(

                        n=>

                        n>=1

                        &&

                        n<=35

                    )

                    &&

                    back.every(

                        n=>

                        n>=1

                        &&

                        n<=12

                    )

                ){



                    history.push({



                        issue:

                        match[1],



                        date:

                        match[2],



                        front,



                        back



                    });



                }



            }






            console.log(

                "History loaded:",

                history.length

            );





            return history;



        }





        catch(error){


            console.log(

                "Data error:",

                error.message

            );


            return [];


        }



    }







}



export default DataManager;