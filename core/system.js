// DLT-AI-CORE V11 FINAL
// core/system.js
// 系统日志与运行状态模块


import fs from "fs";


class System {


    constructor(){


        this.file =

        "./logs/system.log";



        this.status = {


            running:

            true,



            errors:

            0,



            startTime:

            new Date()

        };



        this.init();


    }





    init(){


        try{


            if(
                !fs.existsSync(
                    "./logs"
                )
            ){


                fs.mkdirSync(
                    "./logs"
                );


            }



            if(
                !fs.existsSync(
                    this.file
                )
            ){


                fs.writeFileSync(
                    this.file,
                    ""
                );


            }



            this.log(

                "SYSTEM START"

            );


        }


        catch(error){


            console.log(

                "System init error:",

                error.message

            );


        }


    }






    write(level,message){


        const line =


        `[${new Date().toISOString()}] ${level}: ${message}\n`;



        try{


            fs.appendFileSync(

                this.file,

                line

            );


        }


        catch(error){


            console.log(

                error.message

            );


        }


        console.log(
            line
        );


    }








    log(message){


        this.write(

            "INFO",

            message

        );


    }








    error(error){


        this.status.errors++;



        this.write(

            "ERROR",

            error.message ||

            error

        );


    }








    getStatus(){


        return {


            ...this.status,


            uptime:

            Date.now()

            -

            this.status.startTime.getTime()


        };


    }




}



export default System;