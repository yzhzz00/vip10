/*
================================

大乐透智能分析系统

V71.1 AI CORE

Risk Agent

风险控制模型

================================
*/


class RiskAgent {



constructor(){


    this.name="Risk AI";


}









analyze(history=[]){



    if(

        !history ||

        history.length===0

    ){



        return {



            error:"无历史数据"



        };



    }








    let latest =

    history[

        history.length-1

    ];








    let risk=[];



    let riskScore=0;









    // =====================
    // 连号风险
    // =====================



    let consecutive=0;





    for(

        let i=1;

        i<latest.front.length;

        i++

    ){



        if(

            latest.front[i]

            -

            latest.front[i-1]

            ===1

        ){



            consecutive++;



        }



    }







    if(consecutive>=2){



        risk.push(

            "连号过多风险"

        );



        riskScore+=10;



    }









    // =====================
    // 奇偶集中风险
    // =====================



    let odd=0;



    latest.front.forEach(n=>{



        if(n%2!==0){



            odd++;



        }



    });









    if(

        odd===0 ||

        odd===5

    ){



        risk.push(

            "奇偶极端结构风险"

        );



        riskScore+=15;



    }









    // =====================
    // 区间集中风险
    // =====================



    let zone={



        z1:0,

        z2:0,

        z3:0



    };








    latest.front.forEach(n=>{



        if(n<=12){



            zone.z1++;



        }

        else if(n<=24){



            zone.z2++;



        }

        else{



            zone.z3++;



        }



    });









    let maxZone =

    Math.max(

        zone.z1,

        zone.z2,

        zone.z3

    );








    if(maxZone>=4){



        risk.push(

            "三区号码过度集中"

        );



        riskScore+=10;



    }









    return {



        agent:this.name,



        riskScore:riskScore,



        level:

        riskScore>=20

        ?

        "高风险"

        :

        "正常风险",




        warnings:risk.length

        ?

        risk

        :

        [

            "未发现明显异常"

        ],






        description:[



            "检测号码集中风险",



            "检测冷热号码比例",



            "检测异常组合结构"



        ]



    };



}











// =====================
// 号码风险评分
// =====================



score(ticket){



    let score=0;



    let front=ticket.front;






    let odd=0;



    front.forEach(n=>{



        if(n%2!==0){



            odd++;



        }



    });








    if(

        odd===0 ||

        odd===5

    ){



        score-=10;



    }



    else{


        score+=3;


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








window.RiskAgent =

new RiskAgent();