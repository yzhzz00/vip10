// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// trend.js
// 趋势分析模块
// ==================================================

"use strict";


window.V100Trend = {



    // ==========================
    // 号码趋势评分
    // ==========================

    score(

        number,

        history

    ){



        let short =

        this.periodScore(

            number,

            history,

            50

        );




        let medium =

        this.periodScore(

            number,

            history,

            200

        );




        let long =

        this.periodScore(

            number,

            history,

            history.length

        );






        return Number(

            (

            short *0.5

            +

            medium*0.3

            +

            long*0.2

            )

            .toFixed(3)

        );



    },









    // ==========================
    // 周期统计
    // ==========================


    periodScore(

        number,

        history,

        size

    ){



        let data=

        history.slice(

            -size

        );



        let count=0;



        data.forEach(item=>{


            if(

            item.front.includes(number)

            ){

                count++;

            }


        });






        return (

            count

            /

            data.length

            *

            100

        );



    },









    // ==========================
    // 趋势方向
    // ==========================


    direction(

        number,

        history

    ){



        let recent=

        this.periodScore(

            number,

            history,

            50

        );




        let old=

        this.periodScore(

            number,

            history,

            200

        );





        if(

            recent>old

        ){


            return "UP";


        }



        if(

            recent<old

        ){


            return "DOWN";


        }



        return "STABLE";



    },









    // ==========================
    // 热度排名
    // ==========================


    ranking(history){



        let list=[];




        for(

            let i=1;

            i<=35;

            i++

        ){



            list.push({



                number:i,



                score:

                this.score(

                    i,

                    history

                )



            });



        }






        return list.sort(

            (a,b)=>

            b.score-a.score

        );



    },









    // ==========================
    // 趋势报告
    // ==========================


    report(history){



        return {


            hot:

            this.ranking(history)

            .slice(

                0,

                5

            ),



            cold:

            this.ranking(history)

            .slice(

                -5

            )



        };



    }



};