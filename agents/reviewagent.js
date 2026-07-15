/*
================================
大乐透AI_V90 AGENTS

reviewagent.js

开奖复盘智能体
================================
*/


class ReviewAgent{


    constructor(){


        this.name="reviewagent";


        this.records=[];


    }









    // ==========================
    // 复盘分析
    // ==========================


    review(predict,real){



        let result={



            predict,


            real,


            hitFront:0,


            hitBack:0,


            analysis:[]



        };








        // 前区命中


        predict.front

        .forEach(n=>{



            if(

            real.front.includes(n)

            ){



                result.hitFront++;



            }



        });








        // 后区命中


        predict.back

        .forEach(n=>{



            if(

            real.back.includes(n)

            ){



                result.hitBack++;



            }



        });









        // 分析


        if(

        result.hitFront>=3

        ){



            result.analysis.push(

            "前区模型有效"

            );


        }

        else{



            result.analysis.push(

            "前区需要优化"

            );


        }







        if(

        result.hitBack>=1

        ){



            result.analysis.push(

            "后区预测正常"

            );


        }

        else{



            result.analysis.push(

            "后区权重需要调整"

            );


        }








        this.records.push(result);








        return result;



    }









    // ==========================
    // 获取记录
    // ==========================


    getRecords(){



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







window.reviewagent=

new ReviewAgent();