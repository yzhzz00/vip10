/*
================================
大乐透AI_V90 AGENTS

criticagent.js

预测批判检查智能体
================================
*/


class CriticAgent{


    constructor(){


        this.name="criticagent";


    }









    // ==========================
    // 批判分析
    // ==========================


    analyze(candidate,score){



        let penalty=0;


        let detail=[];








        let front=

        [...candidate.front]

        .sort(

        (a,b)=>a-b

        );








        // ==================
        // 检查极端号码集中
        // ==================


        let high=

        front.filter(

            n=>n>28

        ).length;







        if(high>=4){



            penalty+=1;


            detail.push(

            "高位号码集中"

            );



        }









        // ==================
        // 检查连续号码
        // ==================


        let link=0;







        for(

        let i=1;

        i<front.length;

        i++

        ){



            if(

            front[i]-front[i-1]===1

            ){



                link++;



            }



        }








        if(link>=3){



            penalty+=1;


            detail.push(

            "连续结构异常"

            );


        }









        // ==================
        // 高分异常检查
        // ==================


        if(

        score>20

        ){



            penalty+=1;


            detail.push(

            "模型高分复核"

            );



        }









        return {



            agent:this.name,



            penalty,



            finalScore:

            score-penalty,



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







window.criticagent=

new CriticAgent();