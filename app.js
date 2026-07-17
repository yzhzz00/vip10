// DLT-AI-CORE V11 FINAL
// app.js
// 应用初始化


import fs from "fs/promises";


import Engine from "./core/engine.js";



class Application {



    constructor(){


        this.config =
        null;


        this.engine =
        null;


        this.ready =
        false;


    }









    async init(){


        await this.loadConfig();



        this.engine =
        new Engine(
            this.config
        );



        await this.engine.init();



        this.ready =
        true;



        console.log(
            "DLT-AI-CORE initialized"
        );



        return this;


    }









    async loadConfig(){


        try{


            const data =

            await fs.readFile(

                "./config/config.json",

                "utf-8"

            );



            this.config =

            JSON.parse(
                data
            );


        }


        catch(e){


            this.config = {


                version:
                "V11 FINAL",


                mode:
                "production"



            };


        }


    }









    getEngine(){


        if(
            !this.ready
        ){


            throw new Error(
                "Application not initialized"
            );


        }



        return this.engine;


    }



}





export default Application;