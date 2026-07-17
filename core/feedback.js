// DLT-AI-CORE VIP
// core/feedback.js
//
// 开奖反馈模块
//
// 作用:
// 输入真实开奖号码
// 对比历史预测
// 计算命中情况
// 输出模型反馈数据


import storage from "./storage.js";



class FeedbackSystem {



    constructor(){


        this.lastFeedback=null;


    }









    // ======================
    // 提交开奖结果
    // ======================

    submit(

        actual,

        prediction

    ){



        const result=


        {


            time:

            new Date()

            .toISOString(),




            actual:{


                front:

                actual.front,


                back:

                actual.back



            },





            prediction:{


                front:

                prediction.front,


                back:

                prediction.back



            }






        };







        result.analysis=

        this.compare(

            actual,

            prediction

        );







        storage.saveFeedback(

            result

        );







        this.lastFeedback=result;







        return result;


    }









    // ======================
    // 比较结果
    // ======================

    compare(

        actual,

        prediction

    ){



        let frontHit=0;

        let backHit=0;






        prediction.front.forEach(num=>{



            if(

                actual.front.includes(num)

            ){


                frontHit++;


            }


        });







        prediction.back.forEach(num=>{



            if(

                actual.back.includes(num)

            ){


                backHit++;


            }


        });








        return {



            frontHit,



            backHit,



            totalHit:

            frontHit+

            backHit,





            level:

            this.level(

                frontHit,

                backHit

            )



        };


    }









    // ======================
    // 命中等级
    // ======================

    level(

        front,

        back

    ){



        if(

            front===5

            &&

            back===2

        )

            return "一等奖";





        if(

            front>=4

            &&

            back>=1

        )

            return "二等奖级别";





        if(

            front>=3

            &&

            back>=1

        )

            return "三等奖附近";






        if(

            front>=2

            &&

            back>=1

        )

            return "低等奖附近";






        return "未命中";



    }









    // ======================
    // 获取反馈
    // ======================

    getLast(){



        return this.lastFeedback;


    }






}



export default new FeedbackSystem();