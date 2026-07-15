/*
================================
大乐透AI_V90 AGENTS

antihumanagent.js

反人类偏差智能体
================================
*/


class AntiHumanAgent{


    constructor(){


        this.name="antihumanagent";


    }









    // ==========================
    // 反偏差分析
    // ==========================


    analyze(candidate,context={}){



        let penalty=0;


        let detail=[];







        let feature=

        context.feature;








        if(feature){



            let hotCount=0;







            candidate.front

            .forEach(n=>{



                let freq=

                feature.frontFrequency[n]

                ||

                0;







                // 过热号码


                if(freq>250){



                    hotCount++;



                }



            });








            if(hotCount>=4){



                penalty+=2;



                detail.push(

                "热门集中风险"

                );



            }



        }









        // ==================
        // 检查号码密集
        // ==================


        let front=

        [...candidate.front]

        .sort(

        (a,b)=>a-b

        );







        let range=

        front[4]-front[0];







        if(range<15){



            penalty+=1;



            detail.push(

            "号码跨度过小"

            );



        }









        // ==================
        // 检查尾数集中
        // ==================


        let tails={};







        front.forEach(n=>{



            let t=

            n%10;







            tails[t]=

            (

            tails[t]||0

            )

            +1;



        });








        Object.values(tails)

        .forEach(v=>{



            if(v>=3){



                penalty+=1;



                detail.push(

                "尾数集中"

                );



            }



        });









        return {



            agent:this.name,



            penalty,



            score:

            -penalty,



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







window.antihumanagent=

new AntiHumanAgent();