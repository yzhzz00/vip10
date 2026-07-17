import fs from "fs";


class DataEngine {


    constructor(){

        this.history=[];

    }



    load(file){


        try{


            let text=

            fs.readFileSync(
                file,
                "utf-8"
            );



            this.history=[];



            text.split(/\r?\n/)
            .forEach(line=>{


                let nums=

                line.match(/\d+/g);



                if(!nums || nums.length<7)

                return;



                let arr=

                nums.map(Number);



                let front=

                arr.slice(0,5);



                let back=

                arr.slice(5,7);



                if(

                    front.length===5

                    &&

                    back.length===2

                ){


                    this.history.push({

                        front,

                        back

                    });


                }



            });



            console.log(

                "历史数据:",

                this.history.length

            );



            return this.history;


        }

        catch(e){


            console.log(

                "数据读取失败",

                e.message

            );


            return [];


        }


    }




    getHistory(){


        return this.history;


    }


}



export default new DataEngine();