// DLT-AI-CORE VIP
// core/learning.js
//
// AI学习模块
//
// 作用:
// 根据开奖反馈调整模型权重
//
// 输入:
// feedback.json
//
// 输出:
// models权重优化


import storage from "./storage.js";



class LearningEngine {



    constructor(){


        this.weights={


            frequency:1,


            trend:1,


            bayes:1,


            markov:1,


            omission:1,


            cycle:1



        };



        this.learningCount=0;


        this.load();


    }









    // ======================
    // 加载学习状态
    // ======================

    load(){



        const data=

        storage.load(

            "models.json"

        );





        if(data && data.weights){



            this.weights=

            data.weights;



            this.learningCount=

            data.learningCount

            ||

            0;


        }


    }









    // ======================
    // 执行学习
    // ======================

    train(){



        const feedback=

        storage.load(

            "feedback.json"

        )

        ||

        [];








        if(

            feedback.length===0

        ){



            return {


                status:

                "no_feedback"



            };


        }









        let recent=

        feedback.slice(

            -50

        );







        let success=0;






        recent.forEach(item=>{



            if(

                item.analysis.totalHit>=3

            ){


                success++;


            }



        });









        let rate=

        success

        /

        recent.length;









        this.adjust(rate);








        this.learningCount++;







        storage.save(

            "models.json",

            {


                weights:

                this.weights,



                learningCount:

                this.learningCount,



                accuracy:

                rate



            }

        );







        return {


            status:

            "learning_complete",



            accuracy:

            Number(

                (

                rate*100

                )

                .toFixed(2)

            ),



            weights:

            this.weights



        };



    }









    // ======================
    // 权重调整
    // ======================

    adjust(rate){



        const step=

        0.05;







        if(rate>0.15){



            Object.keys(

                this.weights

            )

            .forEach(key=>{



                this.weights[key]

                +=step;



            });



        }

        else{



            this.weights.trend

            +=step;



            this.weights.omission

            +=step;



            this.weights.frequency

            -=0.02;



        }







        this.normalize();



    }









    // ======================
    // 权重归一化
    // ======================

    normalize(){



        Object.keys(

            this.weights

        )

        .forEach(key=>{



            if(

                this.weights[key]<0.1

            )

                this.weights[key]=0.1;



            if(

                this.weights[key]>3

            )

                this.weights[key]=3;



        });



    }









    // ======================
    // 状态
    // ======================

    status(){



        return {


            learningCount:

            this.learningCount,



            weights:

            this.weights



        };


    }



}



export default new LearningEngine();