/*
================================

大乐透智能分析系统

V71.1 AI CORE

Markov Agent

马尔可夫转移模型

================================
*/


class MarkovAgent {



constructor(){


    this.name="Markov AI";


}









analyze(history=[]){



    if(

        !history ||

        history.length<2

    ){



        return {



            error:"历史数据不足"



        };



    }







    let transition={};






    for(

        let i=1;

        i<history.length;

        i++

    ){



        let prev =

        history[i-1].front;



        let next =

        history[i].front;







        prev.forEach(a=>{



            if(!transition[a]){



                transition[a]={};



            }






            next.forEach(b=>{



                if(!transition[a][b]){



                    transition[a][b]=0;



                }



                transition[a][b]++;



            });



        });



    }







    let probability={};







    Object.keys(transition)

    .forEach(a=>{



        let total=0;



        Object.values(

            transition[a]

        )

        .forEach(v=>{


            total+=v;


        });







        probability[a]={};






        Object.keys(

            transition[a]

        )

        .forEach(b=>{



            probability[a][b]=

            Number(

                (

                transition[a][b]

                /

                total

                )

                .toFixed(4)

            );



        });



    });









    return {



        agent:this.name,



        transition:probability,



        description:[



            "分析上一期到下一期号码转移",



            "计算号码出现迁移概率",



            "等待蒙特卡罗概率融合"



        ]



    };



}











// =====================
// 获取下一期候选号码
// =====================



predict(lastNumbers=[]){



    let result={};






    lastNumbers.forEach(num=>{



        result[num]=[];



    });







    return result;



}











// =====================
// 转移评分
// =====================



score(number,lastNumbers,history){



    let score=0;







    if(

        !history ||

        history.length<2

    ){



        return score;



    }







    let last =

    history[

        history.length-1

    ].front;







    if(

        last.includes(number)

    ){



        score-=2;



    }

    else{



        score+=1;



    }







    return score;



}









status(){



    return {



        agent:this.name,


        ready:true



    };



}



}








window.MarkovAgent =

new MarkovAgent();