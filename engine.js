/*
================================
大乐透AI_V90

engine.js

系统启动入口
================================
*/


class V90Engine{


    constructor(){


        this.status="idle";


        this.modules=[];


    }







    // ==========================
    // 启动系统
    // ==========================

    async start(){



        console.log(

        "V90 AI CORE START"

        );



        this.status="loading";






        await this.loadModules();







        this.init();







        this.status="ready";






        console.log(

        "V90 SYSTEM READY"

        );



    }









    // ==========================
    // 注册模块
    // ==========================


    async loadModules(){



        this.modules=[


            "core/dataengine.js",


            "core/featureengine.js",


            "core/theoryengine.js",


            "core/markovengine.js",


            "core/matrixengine.js",


            "core/bayesengine.js",


            "core/montecarloengine.js",


            "core/trainingengine.js",


            "core/predictionengine.js",


            "core/scoringengine.js",


            "core/riskengine.js",


            "core/evaluationengine.js",


            "core/learningengine.js",


            "core/loadingengine.js",


            "core/taskengine.js",


            "core/masterengine.js",


            "agents/trendagent.js",


            "agents/structureagent.js",


            "agents/markovagent.js",


            "agents/riskagent.js",


            "agents/reviewagent.js",


            "agents/theoryagent.js",


            "agents/criticagent.js",


            "agents/learningagent.js",


            "agents/antihumanagent.js",


            "agents/masteragent.js"



        ];





    }









    // ==========================
    // 初始化
    // ==========================


    init(){



        if(

        window.masterengine

        ){



            window.masterengine.init();



        }





    }









    // ==========================
    // 获取状态
    // ==========================


    getStatus(){



        return {


            status:this.status,


            modules:this.modules.length



        };


    }



}








window.v90engine=

new V90Engine();








window.addEventListener(

"load",

()=>{


    window.v90engine.start();


}

);