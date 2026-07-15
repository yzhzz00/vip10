/*
================================

大乐透智能分析系统

V71.1 AI CORE

Frequency Engine

历史频率引擎

================================
*/


class FrequencyEngine {



constructor(){


    this.name="Frequency Engine";


    this.front={};


    this.back={};


    this.loaded=false;



}









load(history=[]){



    this.front={};


    this.back={};






    history.forEach(item=>{



        item.front.forEach(n=>{



            if(!this.front[n]){


                this.front[n]=0;


            }



            this.front[n]++;



        });







        item.back.forEach(n=>{



            if(!this.back[n]){


                this.back[n]=0;


            }



            this.back[n]++;



        });



    });







    this.loaded=true;



}











// =====================
// 号码评分
// =====================



score(ticket){



    let score=0;






    ticket.front.forEach(n=>{



        let count=

        this.front[n] || 0;






        if(count>400){



            score+=3;



        }

        else if(count>250){



            score+=2;



        }

        else if(count<100){



            score-=1;



        }



    });









    ticket.back.forEach(n=>{



        let count=

        this.back[n] || 0;






        if(count>150){



            score+=2;



        }

        else if(count<40){



            score-=1;



        }



    });







    return score;



}











// =====================
// 前区排序
// =====================



frontRank(){



    let arr=[];



    for(let i=1;i<=35;i++){



        arr.push({



            number:i,



            count:

            this.front[i] || 0



        });



    }






    return arr.sort(

        (a,b)=>

        b.count-a.count

    );



}











// =====================
// 后区排序
// =====================



backRank(){



    let arr=[];



    for(let i=1;i<=12;i++){



        arr.push({



            number:i,



            count:

            this.back[i] || 0



        });



    }






    return arr.sort(

        (a,b)=>

        b.count-a.count

    );



}









status(){



    return {



        engine:this.name,



        loaded:this.loaded



    };



}



}








window.FrequencyEngine =

new FrequencyEngine();