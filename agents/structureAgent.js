/*
================================

大乐透智能分析系统

V71.1 AI CORE

Structure Agent

结构分析模型

================================
*/


class StructureAgent {



constructor(){


    this.name="Structure AI";


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







    return {



        agent:this.name,



        oddEven:

        this.oddEven(

            latest.front

        ),




        bigSmall:

        this.bigSmall(

            latest.front

        ),




        zone:

        this.zone(

            latest.front

        ),




        shape:

        this.shape(

            latest.front

        ),




        description:[



            "分析奇偶结构",



            "分析三区分布",



            "分析号码组合形态"



        ]



    };



}











// =====================
// 奇偶结构
// =====================



oddEven(nums){



    let odd=0;



    nums.forEach(n=>{



        if(n%2!==0){



            odd++;



        }



    });







    return {



        odd:odd,


        even:5-odd,



        pattern:

        odd+":"+(5-odd)



    };



}









// =====================
// 大小结构
// 1-17小
// 18-35大
// =====================



bigSmall(nums){



    let small=0;


    let big=0;





    nums.forEach(n=>{



        if(n<=17){



            small++;



        }

        else{



            big++;



        }



    });







    return {



        small:small,


        big:big,



        pattern:

        small+":"+big



    };



}









// =====================
// 三区
// =====================



zone(nums){



    let zone1=0;


    let zone2=0;


    let zone3=0;







    nums.forEach(n=>{



        if(n<=12){



            zone1++;



        }

        else if(n<=24){



            zone2++;



        }

        else{



            zone3++;



        }



    });






    return {



        zone1:zone1,


        zone2:zone2,


        zone3:zone3



    };



}









// =====================
// 组合形态
// =====================



shape(nums){



    let consecutive=0;



    let span=

    nums[4]-nums[0];






    for(

        let i=1;

        i<nums.length;

        i++

    ){



        if(

            nums[i]-nums[i-1]===1

        ){



            consecutive++;



        }



    }








    return {



        span:span,



        consecutive:consecutive,



        type:

        consecutive>=1

        ?

        "存在连号结构"

        :

        "分散结构"



    };



}









score(ticket){



    let score=0;






    let oe=

    this.oddEven(

        ticket.front

    );





    if(

        oe.odd===2 ||

        oe.odd===3

    ){



        score+=5;



    }






    let bs=

    this.bigSmall(

        ticket.front

    );





    if(

        bs.small>=1 &&

        bs.big>=1

    ){



        score+=5;



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








window.StructureAgent =

new StructureAgent();