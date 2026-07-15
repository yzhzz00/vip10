/*
================================
大乐透AI_V90 AGENTS

riskagent.js

风险判断智能体
================================
*/


class RiskAgent{


    constructor(){


        this.name="riskagent";


    }









    // ==========================
    // 风险分析
    // ==========================


    analyze(candidate){



        let risk=0;


        let detail=[];







        if(

        window.riskengine

        ){



            risk=

            window.riskengine.score(

                candidate

            );



        }









        if(risk>=3){



            detail.push(

            "高风险组合"

            );



        }

        else{



            detail.push(

            "风险正常"

            );



        }









        return {



            agent:this.name,



            risk,



            score:

            -risk,



            detail



        };



    }









    status(){



        return {



            agent:this.name,


            ready:true



        };



    }



}







window.riskagent=

new RiskAgent();