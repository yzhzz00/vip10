// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// probability.js
// 号码概率评分系统
// ==================================================

"use strict";


window.V100Probability = {



    // ==========================
    // 前区号码评分
    // ==========================


    numberScore(
        number,
        history
    ){



        let frequency =

        this.frequencyScore(

            number,

            history

        );




        let recent =

        this.recentScore(

            number,

            history

        );




        let missing =

        this.missingScore(

            number,

            history

        );





        let coldHot =

        this.coldHotScore(

            number,

            history

        );






        return Number(

        (

            frequency*0.35

            +

            recent*0.25

            +

            missing*0.25

            +

            coldHot*0.15


        )
        .toFixed(3)

        );



    },









    // ==========================
    // 后区评分
    // ==========================


    backScore(
        number,
        history
    ){



        let count=0;



        history.forEach(item=>{


            if(

            item.back.includes(number)

            ){


                count++;


            }



        });





        return count;



    },









    // ==========================
    // 历史频率
    // ==========================


    frequencyScore(
        number,
        history
    ){



        let count=0;



        history.forEach(item=>{


            if(

            item.front.includes(number)

            ){


                count++;


            }



        });




        return count /

        history.length *

        100;



    },









    // ==========================
    // 最近热度
    // ==========================


    recentScore(
        number,
        history
    ){



        let recent =

        history.slice(
            -100
        );




        let count=0;



        recent.forEach(item=>{


            if(

            item.front.includes(number)

            ){


                count++;


            }



        });





        return count;



    },









    // ==========================
    // 遗漏评分
    // ==========================


    missingScore(
        number,
        history
    ){



        let miss=0;



        for(
            let i=
            history.length-1;

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






        /*
        遗漏不是越大越好

        转换：

        中等遗漏提高

        极端遗漏降低

        */



        if(
            miss>30
        ){

            return 10;


        }



        return 30-

        Math.abs(
            miss-15
        );



    },









    // ==========================
    // 冷热评分
    // ==========================


    coldHotScore(
        number,
        history
    ){



        let recent=

        history.slice(
            -50
        );



        let count=0;



        recent.forEach(item=>{


            if(

            item.front.includes(number)

            ){


                count++;


            }


        });






        if(
            count>=8
        ){

            return 80;

        }



        if(
            count<=2
        ){

            return 60;

        }




        return 70;



    },









    // ==========================
    // 组合评分
    // ==========================


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






        back.forEach(n=>{


            score +=

            this.backScore(

                n,

                history

            );


        });








        // 结构加分


        if(
            window.V100Structure
        ){


            let s=

            V100Structure.check(
                front
            );


            score +=

            s.score || 0;



        }





        return Number(

            score.toFixed(3)

        );



    }



};