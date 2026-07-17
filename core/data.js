// DLT-AI-CORE V11 FINAL
// core/data.js
// 大乐透历史数据解析


import fs from "fs";


class DataManager {


    constructor(){

        this.file =
        "./data/dlt_history.txt";

    }





    load(){


        try{


            if(
                !fs.existsSync(this.file)
            ){

                console.log(
                    "History file missing"
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

            .split("\n")

            .filter(
                line=>line.trim()
            );



            const history=[];




            for(const line of lines){



                /*
                 格式:

                 07001 日期 前区5个 后区2个

                */



                const match =

                line.match(

                    /\d{5}\s+\d{4}-\d{2}-\d{2}\s+(.+?)\s+(\d{2}\s+\d{2})$/

                );



                if(!match){

                    continue;

                }




                const frontText =

                match[1]

                .trim();



                const backText =

                match[2]

                .trim();






                const front =

                frontText

                .split(/\s+/)

                .map(Number);





                const back =

                backText

                .split(/\s+/)

                .map(Number);






                if(
                    front.length===5
                    &&
                    back.length===2
                ){


                    history.push({

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

                "Data load error:",

                error.message

            );


            return [];


        }


    }



}



export default DataManager;