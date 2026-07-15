/*
================================

大乐透智能分析系统

V71.1 AI CORE

Theory Agent

大乐透理论库模型

================================
*/


class TheoryAgent {



constructor(){


    this.name="Theory AI";


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

        this.analyzeOddEven(

            history

        ),




        bigSmall:

        this.analyzeBigSmall(

            history

        ),




        zone:

        this.analyzeZone(

            history

        ),




        sum:

        this.analyzeSum(

            history

        ),




        description:[



            "奇偶结构理论分析完成",



            "大小比例理论分析完成",



            "三区分布理论分析完成",



            "和值模型分析完成"



        ]



    };



}










// =====================
// 奇偶结构
// =====================



analyzeOddEven(history){



    let item=

    history[

        history.length-1

    ];



    let odd=0;



    item.front.forEach(n=>{



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
// 大乐透前区
// 1-17小 18-35大
// =====================



analyzeBigSmall(history){



    let item=

    history[

        history.length-1

    ];



    let small=0;


    let big=0;





    item.front.forEach(n=>{



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
// 1-12
// 13-24
// 25-35
// =====================



analyzeZone(history){



    let item=

    history[

        history.length-1

    ];



    let zone1=0;


    let zone2=0;


    let zone3=0;






    item.front.forEach(n=>{



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
// 和值
// =====================



analyzeSum(history){



    let item=

    history[

        history.length-1

    ];



    let value=

    item.front.reduce(

        (a,b)=>a+b,

        0

    );







    let range="正常和值";





    if(value<70){



        range="偏低和值";


    }



    if(value>140){



        range="偏高和值";


    }






    return {



        value:value,



        range:range



    };



}









status(){



    return {



        agent:this.name,


        ready:true



    };



}



}








window.TheoryAgent =

new TheoryAgent();