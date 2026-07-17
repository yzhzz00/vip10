// DLT-AI-CORE V11 FINAL
// core/engine.js
// AI核心引擎
// 连接全部模块


import DataManager from "./data.js";
import Theory from "./theory.js";
import Models from "./models.js";
import Matrix from "./matrix.js";
import Committee from "./committee.js";
import Score from "./score.js";
import Feedback from "./feedback.js";
import Backtest from "./backtest.js";
import Cache from "./cache.js";
import Scheduler from "./scheduler.js";



class Engine {



    constructor(){



        this.data =

        new DataManager();



        this.history =

        this.data.load();



        this.historyCount =

        this.history.length;



        this.theory =

        new Theory();



        this.models =

        new Models();



        this.matrix =

        new Matrix();



        this.committee =

        new Committee();



        this.score =

        new Score();



        this.feedback =

        new Feedback();



        this.cache =

        new Cache();



        this.scheduler =

        new Scheduler();



        this.backtester =

        new Backtest(this);



    }









    async predict(history=this.history){



        if(

            !history ||

            history.length===0

        ){


            throw new Error(

                "没有历史数据"

            );


        }






        // 1 大乐透理论


        const theory =

        this.theory.analyze(

            history

        );








        // 2 AI模型


        const models =

        this.models.run(

            history

        );








        // 3 矩阵


        const matrix =

        this.matrix.build(

            models

        );








        // 4 委员会


        const committee =

        this.committee.vote(

            models

        );








        // 5 综合评分


        const ranking =

        this.score.calculate({



            models,



            matrix,



            committee,



            theory



        });








        const front =

        this.score.generate(

            ranking

        );








        const back =

        this.score.generateBack(

            history

        );








        const result = {


            time:

            new Date(),



            front,



            back,



            models,



            theory,



            matrix,



            committee



        };






        this.cache.save(

            "predict",

            result

        );



        return result;



    }









    async backtest(limit=100){



        return await this.backtester.run(

            this.history,

            limit

        );


    }








    async learning(){



        return {


            times:

            this.feedback.history.length,



            committee:

            this.committee.status(),



            feedback:

            this.feedback.getStatus()



        };


    }








    reload(){



        this.history =

        this.data.load();



        this.historyCount =

        this.history.length;



        return this.historyCount;


    }





}



export default Engine;