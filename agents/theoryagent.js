/*
================================
大乐透AI_V90 AGENTS

theoryagent.js

理论规则智能体
================================
*/


class TheoryAgent{


    constructor(){


        this.name="theoryagent";


    }









    // ==========================
    // 理论分析
    // ==========================


    analyze(candidate){



        let score=0;


        let detail=[];








        if(

        window.theoryengine

        ){



            let result=

            window.theoryengine.check(

                candidate

            );







            score=

            result.score;






            if(result.valid){



                detail.push(

                "号码结构合法"

                );


            }

            else{



                detail.push(

                "号码结构异常"

                );



            }



        }

        else{



            detail.push(

            "理论模块未加载"

            );



        }








        return {



            agent:this.name,



            score,



            detail



        };



    }









    status(){



        return {



            agent:this.name,


            ready:

            !!window.theoryengine



        };



    }



}







window.theoryagent=

new TheoryAgent();