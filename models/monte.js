// models/monte.js


export class MonteModel {


    constructor(){


        this.name =
        "monte";


        this.historySize=0;


    }





    // =====================
    // 训练
    // =====================

    train(history){


        this.historySize =
        history.length;


    }





    // =====================
    // 随机概率评分
    // =====================

    randomScore(){


        return Math.random();


    }





    // =====================
    // 候选评分
    // =====================

    predict(candidate){



        let base = 0;



        /*
        
        蒙特卡罗模型特点：

        不判断热冷

        不固定规律

        提供随机采样权重


        */



        candidate.front.forEach(()=>{


            base +=
            this.randomScore();


        });



        candidate.back.forEach(()=>{


            base +=
            this.randomScore();


        });





        return {


            model:
            this.name,


            score:
            base



        };



    }



}