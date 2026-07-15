/*
================================
大乐透AI_V90 AGENTS

masteragent.js

Agent总控智能体
================================
*/


class MasterAgent{


    constructor(){


        this.name="masteragent";


        this.result=[];


    }









    // ==========================
    // 综合分析
    // ==========================


    analyze(candidates,context={}){



        let results=[];







        candidates.forEach(candidate=>{



            let total=0;


            let details=[];








            // 趋势


            if(window.trendagent){



                let r=

                window.trendagent.analyze(

                    candidate,

                    context

                );







                total+=r.score;


                details.push(r);



            }








            // 结构


            if(window.structureagent){



                let r=

                window.structureagent.analyze(

                    candidate

                );







                total+=r.score;


                details.push(r);



            }








            // 马尔可夫


            if(window.markovagent){



                let r=

                window.markovagent.analyze(

                    candidate,

                    context.last

                );







                total+=r.score;


                details.push(r);



            }








            // 理论


            if(window.theoryagent){



                let r=

                window.theoryagent.analyze(

                    candidate

                );







                total+=r.score;


                details.push(r);



            }








            // 风险


            if(window.riskagent){



                let r=

                window.riskagent.analyze(

                    candidate

                );







                total+=r.score;


                details.push(r);



            }








            // 批判


            if(window.criticagent){



                let r=

                window.criticagent.analyze(

                    candidate,

                    total

                );







                total=

                r.finalScore;


                details.push(r);



            }








            // 反人类


            if(window.antihumanagent){



                let r=

                window.antihumanagent.analyze(

                    candidate,

                    context

                );







                total+=r.score;


                details.push(r);



            }








            results.push({



                candidate,


                score:

                Number(

                total.toFixed(6)

                ),



                details



            });



        });









        results.sort(

            (a,b)=>

            b.score-a.score

        );







        this.result=

        results.slice(

            0,

            10

        );








        return this.result;



    }









    getResult(){



        return this.result;



    }









    status(){



        return {



            agent:this.name,


            count:

            this.result.length



        };



    }



}







window.masteragent=

new MasterAgent();