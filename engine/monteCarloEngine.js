/*
================================

大乐透智能分析系统

V71.1 AI CORE

Monte Carlo Engine

蒙特卡罗模拟模块

================================
*/


class MonteCarloEngine {



constructor(){


    this.name = "Monte Carlo Engine";


    this.simulationCount = 100000;



}









simulate(history=[]){



    let results=[];






    for(let i=0;i<20000;i++){



        let ticket = this.randomTicket();




        let score =

        this.scoreTicket(

            ticket,

            history

        );





        results.push({



            front:ticket.front,


            back:ticket.back,


            score:score



        });



    }







    results.sort(

        (a,b)=>b.score-a.score

    );







    return {



        engine:this.name,



        simulation:

        this.simulationCount,



        top:

        results.slice(0,20)



    };



}









randomTicket(){



    let front=[];




    while(front.length<5){



        let n =

        Math.floor(

            Math.random()*35

        )+1;





        if(!front.includes(n)){



            front.push(n);


        }



    }





    front.sort(

        (a,b)=>a-b

    );







    let back=[];






    while(back.length<2){



        let n =

        Math.floor(

            Math.random()*12

        )+1;





        if(!back.includes(n)){



            back.push(n);


        }



    }





    back.sort(

        (a,b)=>a-b

    );






    return {


        front,


        back



    };



}









scoreTicket(ticket,history){



    let score=50;






    // =====================
    // 频率评分
    // =====================



    if(window.FrequencyEngine){



        score +=

        FrequencyEngine.score(

            ticket

        );



    }









    // =====================
    // 奇偶结构
    // =====================



    let odd=0;



    ticket.front.forEach(num=>{


        if(num%2!==0){


            odd++;


        }



    });





    if(

        odd===2 ||

        odd===3

    ){



        score+=10;



    }

    else{


        score-=5;


    }









    // =====================
    // 三区结构
    // =====================



    let zone=[0,0,0];





    ticket.front.forEach(num=>{



        if(num<=12){


            zone[0]++;


        }

        else if(num<=24){


            zone[1]++;


        }

        else{


            zone[2]++;


        }



    });







    if(

        zone[0]>=1 &&

        zone[1]>=1 &&

        zone[2]>=1

    ){



        score+=8;



    }








    // =====================
    // 和值
    // =====================



    let sum =

    ticket.front.reduce(

        (a,b)=>a+b,

        0

    );





    if(

        sum>=80 &&

        sum<=130

    ){



        score+=8;



    }






    return Number(

        score.toFixed(2)

    );



}









status(){



    return {



        engine:this.name,


        simulation:

        this.simulationCount



    };



}



}








window.MonteCarloEngine =

new MonteCarloEngine();