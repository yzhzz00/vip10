// DLT-AI-CORE VIP
// core/logger.js
// 系统日志管理


import fs from "fs";
import path from "path";


class Logger {



    constructor(){


        this.dir =

        "./logs";



        if(

            !fs.existsSync(

                this.dir

            )

        ){

            fs.mkdirSync(

                this.dir

            );

        }


    }







    write(file,message){



        const time =

        new Date()

        .toISOString();



        const text =

        `[${time}] ${message}\n`;



        fs.appendFileSync(

            path.join(

                this.dir,

                file

            ),

            text

        );


    }









    system(message){



        this.write(

            "system.log",

            message

        );


    }







    prediction(message){



        this.write(

            "prediction.log",

            message

        );


    }







    learning(message){



        this.write(

            "learning.log",

            message

        );


    }







    error(message){



        this.write(

            "error.log",

            message

        );


    }





}



export default new Logger();