/*
================================
大乐透AI_V90 AGENTS

structureagent.js

号码结构分析智能体
================================
*/


class StructureAgent{


    constructor(){


        this.name="structureagent";


    }









    // ==========================
    // 结构分析
    // ==========================


    analyze(candidate){



        let score=0;


        let detail=[];








        let front=

        [...candidate.front]

        .sort(

        (a,b)=>a-b

        );








        // ==================
        // 奇偶结构
        // ==================


        let odd=

        front.filter(

            n=>n%2!==0

        ).length;








        if(

        odd>=2

        &&

        odd<=3

        ){



            score+=2;


            detail.push(

            "奇偶合理"

            );


        }

        else{


            score-=1;


            detail.push(

            "奇偶偏离"

            );


        }









        // ==================
        // 和值结构
        // ==================


        let sum=

        front.reduce(

            (a,b)=>a+b,

            0

        );







        if(

        sum>=80

        &&

        sum<=130

        ){



            score+=2;


            detail.push(

            "和值合理"

            );


        }

        else{


            score-=1;


        }









        // ==================
        // 区间结构
        // ==================


        let low=

        front.filter(

            n=>n<=12

        ).length;







        let middle=

        front.filter(

            n=>n>12

            &&

            n<=24

        ).length;







        let high=

        front.filter(

            n=>n>24

        ).length;








        if(

        low>=1

        &&

        middle>=1

        &&

        high>=1

        ){



            score+=2;


            detail.push(

            "三区覆盖"

            );


        }









        // ==================
        // 连号
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








        if(

        link<=2

        ){



            score+=1;


            detail.push(

            "连号正常"

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


            ready:true



        };



    }



}







window.structureagent=

new StructureAgent();