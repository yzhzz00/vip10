// DLT-AI-CORE VIP
// core/feedback.js
// 开奖反馈模块
//
// 功能：
// 1. 输入真实开奖号码
// 2. 对比预测结果
// 3. 统计模型表现
// 4. 提供学习数据


class Feedback {



    constructor(){


        this.history=[];


    }









    // ======================
    // 分析一次预测结果
    // ======================

    analyze(prediction, actual){



        if(

            !prediction

            ||

            !actual

        ){



            throw new Error(

                "反馈数据为空"

            );


        }








        const frontHit =

        this.compare(

            prediction.front,

            actual.front

        );






        const backHit =

        this.compare(

            prediction.back,

            actual.back

        );







        const result={



            prediction,


            actual,



            frontHit,



            backHit,



            score:

            this.score(

                frontHit,

                backHit

            ),



            time:

            new Date()

            .toISOString()



        };








        this.history.push(

            result

        );






        return result;



    }









    // ======================
    // 命中数量
    // ======================

    compare(a,b){



        let count=0;






        a.forEach(num=>{



            if(

                b.includes(num)

            ){



                count++;



            }



        });






        return count;



    }









    // ======================
    // 反馈评分
    // ======================

    score(front,back){



        let score=0;






        if(

            front===5

        ){



            score+=100;



        }

        else if(

            front===4

        ){



            score+=50;



        }

        else if(

            front===3

        ){



            score+=20;



        }

        else if(

            front===2

        ){



            score+=5;



        }








        if(

            back===2

        ){



            score+=50;



        }

        else if(

            back===1

        ){



            score+=10;



        }







        return score;



    }









    // ======================
    // 获取学习样本
    // ======================

    getLearningData(){



        return [

            ...this.history

        ];



    }





}



export default Feedback;