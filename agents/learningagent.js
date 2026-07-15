/*
================================
大乐透AI_V90 AGENTS

learningagent.js

学习优化智能体
================================
*/


class LearningAgent{


    constructor(){


        this.name="learningagent";


        this.records=[];


    }









    // ==========================
    // 学习反馈
    // ==========================


    learn(feedback){



        let result={



            time:

            Date.now(),



            feedback,



            adjustment:{}



        };








        if(

        feedback.hitFront>=3

        ){



            result.adjustment={



                trend:"+",

                markov:"+"



            };



        }

        else{



            result.adjustment={



                risk:"+",


                theory:"+"



            };



        }








        this.records.push(result);







        // 调用核心学习模块


        if(

        window.learningengine

        ){



            window.learningengine.learn(

                feedback

            );



        }







        return result;



    }









    // ==========================
    // 获取学习记录
    // ==========================


    history(){



        return this.records;



    }









    status(){



        return {



            agent:this.name,


            records:

            this.records.length



        };



    }



}







window.learningagent=

new LearningAgent();