/*
================================
大乐透AI_V90 AGENTS

markovagent.js

马尔可夫分析智能体
================================
*/


class MarkovAgent{


    constructor(){


        this.name="markovagent";


    }









    // ==========================
    // 马尔可夫分析
    // ==========================


    analyze(candidate,last){



        let score=0;







        if(

        !last

        ||

        !window.markovengine

        ){



            return {



                agent:this.name,


                score:0,


                detail:"无转移数据"



            };



        }








        last.forEach(old=>{



            let probability=

            window.markovengine.predict(

                old

            );








            candidate.front

            .forEach(next=>{



                if(

                probability[next]

                ){



                    score+=

                    probability[next];



                }



            });



        });








        return {



            agent:this.name,



            score:

            Number(

            score.toFixed(6)

            ),



            detail:

            "一阶转移分析完成"



        };



    }









    status(){



        return {



            agent:this.name,


            ready:true



        };



    }



}







window.markovagent=

new MarkovAgent();