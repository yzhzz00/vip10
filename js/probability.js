// ==================================================
// 大乐透 AI V100 CORE FINAL
// probability.js
// 概率评分模型
// ==================================================

"use strict";


window.V100Probability = {



    // ==================================
    // 单个号码评分
    // ==================================


    numberScore(
        number,
        history
    ){


        let score=0;



        // 最近500期

        let recent=

        history.slice(-500);





        let count=0;



        recent.forEach(draw=>{


            if(
                draw.front.includes(number)
            ){

                count++;

            }


        });




        // 频率评分

        score +=

        count/500*40;






        // 遗漏评分


        let miss=

        this.missing(
            number,
            history
        );



        if(miss>20){

            score+=15;

        }

        else if(miss>10){

            score+=8;

        }

        else{

            score+=3;

        }






        // 热度评分


        let hot=

        this.recentHot(
            number,
            history
        );



        score += hot;







        return Number(

            score.toFixed(3)

        );


    },








    // ==================================
    // 遗漏计算
    // ==================================


    missing(
        number,
        history
    ){



        let miss=0;



        for(
            let i=history.length-1;

            i>=0;

            i--
        ){



            if(
                history[i]
                .front
                .includes(number)
            ){

                break;

            }



            miss++;


        }




        return miss;


    },








    // ==================================
    // 最近热度
    // ==================================


    recentHot(
        number,
        history
    ){


        let recent=

        history.slice(-30);



        let count=0;



        recent.forEach(draw=>{


            if(
                draw.front.includes(number)
            ){

                count++;

            }


        });





        return count*2;



    },









    // ==================================
    // 一组号码评分
    // ==================================


    combinationScore(
        front,
        back,
        history
    ){


        let score=0;



        front.forEach(n=>{


            score +=

            this.numberScore(
                n,
                history
            );


        });







        // 后区评分

        back.forEach(n=>{


            score +=

            this.backScore(
                n,
                history
            );


        });





        return Number(

            score.toFixed(3)

        );



    },








    // ==================================
    // 后区评分
    // ==================================


    backScore(
        number,
        history
    ){


        let score=0;



        let recent=

        history.slice(-300);



        let count=0;



        recent.forEach(draw=>{


            if(
                draw.back.includes(number)
            ){

                count++;

            }


        });





        score +=

        count/300*50;





        let miss=

        this.backMissing(
            number,
            history
        );



        if(miss>15){

            score+=10;

        }




        return score;



    },







    backMissing(
        number,
        history
    ){



        let miss=0;



        for(
            let i=history.length-1;

            i>=0;

            i--
        ){



            if(
                history[i]
                .back
                .includes(number)
            ){

                break;

            }


            miss++;


        }




        return miss;


    }






};