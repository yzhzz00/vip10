// DLT-AI-CORE V11 FINAL
// core/engine.js
// 系统核心引擎
// 负责所有模块调度


import DataManager from "./data.js";
import Theory from "./theory.js";
import Models from "./models.js";
import MatrixAI from "./matrix.js";
import Committee from "./committee.js";
import Score from "./score.js";
import Scheduler from "./scheduler.js";
import Backtest from "./backtest.js";
import Feedback from "./feedback.js";
import Cache from "./cache.js";



class Engine {


    constructor(){


        this.data = new DataManager();


        this.theory = new Theory();


        this.models = new Models();


        this.matrix = new MatrixAI();


        this.committee = new Committee();


        this.score = new Score();


        this.scheduler = new Scheduler();


        this.backtest = new Backtest();


        this.feedback = new Feedback();


        this.cache = new Cache();



        this.history = [];


        this.historyCount = 0;


        this.ready = false;


    }






    async init(){


        console.log(
            "Engine initializing..."
        );



        this.history =

        this.data.load();



        this.historyCount =

        this.history.length;



        this.ready = true;



        console.log(
            "Engine ready"
        );



        return true;


    }






    async predict(){


        if(!this.ready){


            throw new Error(
                "Engine not initialized"
            );


        }




        // 理论分析

        const theory =

        this.theory.analyze(
            this.history
        );






        // 多模型分析

        const models =

        this.models.analyze(
            this.history
        );






        // 矩阵分析

        const matrix =

        this.matrix.analyze(
            this.history
        );






        // AI委员会

        const committee =

        this.committee.decide(
            models
        );






        // 综合评分

        const ranking =

        this.score.calculate({

            theory,

            models,

            matrix,

            committee


        });






        // 生成号码

        const front =

        this.score.generate(
            ranking
        );





        // 后区生成

        const back =

        this.generateBack();






        const result = {


            time:

            new Date(),



            front,



            back,



            score:

            ranking.slice(0,20),



            models,



            theory



        };







        this.cache.set(

            "prediction",

            result

        );



        return result;


    }








    // 快速预测

    quickPredict(history){


        const models =

        this.models.analyze(
            history
        );



        const committee =

        this.committee.decide(
            models
        );



        const ranking =

        this.score.calculate({

            theory:
            this.theory.analyze(history),


            models,


            matrix:
            this.matrix.analyze(history),


            committee

        });




        return {


            front:

            this.score.generate(
                ranking
            ),



            back:

            this.generateBack()


        };


    }








    generateBack(){


        const count={};



        for(const item of this.history){


            for(const n of item.back){


                count[n]=

                (count[n]||0)+1;


            }


        }



        return Object.entries(count)

        .sort(

            (a,b)=>

            b[1]-a[1]

        )

        .slice(0,2)

        .map(

            x=>

            Number(x[0])

        )

        .sort(

            (a,b)=>

            a-b

        );


    }






    async runBacktest(){


        const result =

        this.backtest.run(

            this.history,

            this,

            [100,500,1000]

        );



        this.cache.set(

            "backtest",

            result

        );



        return result;


    }







    feedbackRecord(data){


        const result =

        this.feedback.record(
            data
        );



        const report =

        this.feedback.getReport();



        this.cache.set(

            "learning",

            report

        );



        return result;


    }






    status(){


        return {


            ready:

            this.ready,


            history:

            this.historyCount,


            models:

            [

                "frequency",

                "trend",

                "bayes",

                "markov",

                "montecarlo"

            ]

        };


    }





}



export default Engine;