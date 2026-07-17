// DLT-AI-CORE VIP
// models/dlt_theory_model.js
//
// 大乐透理论模型
//
// 负责结构评分


class DltTheoryModel {


    constructor(){


        this.front=[];


        this.back=[];


    }









    train(history){


        this.history=history;


        return true;


    }









    analyze(){



        // 生成理论评分池

        this.front=[];


        this.back=[];






        for(

            let i=1;

            i<=35;

            i++

        ){



            this.front.push({



                number:i,



                score:

                this.numberScore(i)



            });



        }






        for(

            let i=1;

            i<=12;

            i++

        ){



            this.back.push({



                number:i,



                score:

                this.backScore(i)



            });



        }







        this.front.sort(

            (a,b)=>

            b.score-a.score

        );







        this.back.sort(

            (a,b)=>

            b.score-a.score

        );







        return {



            front:this.front,


            back:this.back



        };


    }









    // ======================
    // 前区号码理论评分
    // ======================

    numberScore(num){



        let score=50;







        // 三区基础

        if(num<=12)

            score+=5;


        else if(num<=24)

            score+=10;


        else

            score+=5;







        // 奇偶平衡

        if(num%2)

            score+=3;

        else

            score+=2;







        return score;


    }









    // ======================
    // 后区评分
    // ======================

    backScore(num){



        let score=50;







        if(num>=4 && num<=9)

            score+=10;







        if(num%2)

            score+=3;

        else

            score+=2;







        return score;


    }









    // ======================
    // 组合结构评分
    // ======================

    combinationScore(

        front,

        back

    ){



        let score=50;







        // 三区

        let zone=[0,0,0];







        front.forEach(num=>{



            if(num<=12)

                zone[0]++;


            else if(num<=24)

                zone[1]++;


            else

                zone[2]++;



        });







        if(

            Math.max(...zone)<=3

        )

            score+=15;







        // 奇偶

        let odd=

        front.filter(

            n=>n%2

        )

        .length;







        if(

            odd>=2

            &&

            odd<=3

        )

            score+=15;







        // 和值

        let sum=

        front.reduce(

            (a,b)=>

            a+b,

            0

        );







        if(

            sum>=80

            &&

            sum<=130

        )

            score+=10;







        // 后区

        if(

            back[0]

            <=

            6

            &&

            back[1]

            >

            6

        )

            score+=10;







        return score;


    }





}





export default new DltTheoryModel();