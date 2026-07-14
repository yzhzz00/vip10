/*
================================

大乐透智能分析系统

V71.1

Frequency Engine

历史频率分析模块

================================
*/


class FrequencyEngine {


constructor(){

    this.name = "Frequency Engine";

    this.frontFrequency = {};
    this.backFrequency = {};

    this.loaded = false;

}






load(history){


    this.frontFrequency = {};
    this.backFrequency = {};


    if(!history || history.length === 0){

        return false;

    }



    history.forEach(item=>{


        // 前区

        if(item.front){

            item.front.forEach(num=>{


                if(!this.frontFrequency[num]){

                    this.frontFrequency[num]=0;

                }


                this.frontFrequency[num]++;


            });

        }





        // 后区

        if(item.back){

            item.back.forEach(num=>{


                if(!this.backFrequency[num]){

                    this.backFrequency[num]=0;

                }


                this.backFrequency[num]++;


            });

        }



    });



    this.loaded=true;


    return true;


}








getFrontFrequency(num){


    return this.frontFrequency[num] || 0;


}








getBackFrequency(num){


    return this.backFrequency[num] || 0;


}








getFrontRank(){


    let result=[];


    for(let i=1;i<=35;i++){


        result.push({

            number:i,

            count:this.getFrontFrequency(i)

        });


    }



    return result.sort(

        (a,b)=>b.count-a.count

    );


}








getBackRank(){


    let result=[];


    for(let i=1;i<=12;i++){


        result.push({

            number:i,

            count:this.getBackFrequency(i)

        });


    }



    return result.sort(

        (a,b)=>b.count-a.count

    );


}








score(ticket){


    let score=0;



    if(!this.loaded){

        return score;

    }




    ticket.front.forEach(num=>{


        let count=

        this.getFrontFrequency(num);



        if(count>=80){

            score+=3;

        }

        else if(count>=50){

            score+=2;

        }

        else if(count<=20){

            score-=1;

        }


    });







    ticket.back.forEach(num=>{


        let count=

        this.getBackFrequency(num);



        if(count>=40){

            score+=2;

        }

        else if(count<=10){

            score-=1;

        }


    });





    return score;


}








status(){


    return {

        engine:this.name,

        loaded:this.loaded,

        frontNumbers:Object.keys(
            this.frontFrequency
        ).length,

        backNumbers:Object.keys(
            this.backFrequency
        ).length

    };


}



}





window.FrequencyEngine =

new FrequencyEngine();