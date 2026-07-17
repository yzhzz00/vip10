import fs from "fs";


class DataEngine {


    constructor(){

        this.history=[];

    }



    load(file){


        if(!fs.existsSync(file)){


            console.log(
                "数据文件不存在:",
                file
            );


            return [];

        }





        let content=

        fs.readFileSync(

            file,

            "utf-8"

        );



        let lines=

        content.split(/\r?\n/);



        this.history=[];




        lines.forEach(line=>{



            let nums=

            line.match(/\d+/g);



            if(!nums)

            return;



            let arr=

            nums.map(Number);




            if(arr.length<7)

            return;




            let front=

            arr.slice(0,5);



            let back=

            arr.slice(5,7);





            let validFront=

            front.every(

                n=>n>=1&&n<=35

            );



            let validBack=

            back.every(

                n=>n>=1&&n<=12

            );






            if(

                validFront

                &&

                validBack

            ){


                this.history.push({


                    front,


                    back



                });


            }



        });





        console.log(

            "有效历史期数:",

            this.history.length

        );



        return this.history;


    }






    getHistory(){


        return this.history;


    }






}



export default new DataEngine();