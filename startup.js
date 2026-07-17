// DLT-AI-CORE V11 FINAL
// startup.js
// 系统启动器


import Application from "./app.js";



class Startup {



    constructor(){


        this.application =
        null;


    }









    async start(){


        console.log(
            "Starting DLT-AI-CORE V11 FINAL..."
        );



        this.application =

        new Application();



        await this.application
        .init();



        console.log(
            "System ready"
        );



        return this.application;


    }



}









const startup =
new Startup();



startup.start()
.then(
    ()=>{


        console.log(
            "DLT-AI-CORE startup completed"
        );


    }
)
.catch(
    error=>{


        console.error(
            "Startup failed:",
            error
        );


        process.exit(
            1
        );


    }
);