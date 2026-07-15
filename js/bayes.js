// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// bayes.js
// 贝叶斯概率修正模块
// ==================================================

"use strict";


window.V100Bayes = {



    // ==========================
    // 号码后验评分
    // ==========================


    score(

        number,

        history

    ){



        let prior =

        this.priorProbability(

            number,

            history

        );





        let recent =

        this.recentEvidence(

            number,

            history

        );






        let posterior =

        this.calculate(

            prior,

            recent

        );






        let weight=1;





        // 调用AI学习权重


        if(
            window.V100Learning
        ){


            let w=

            V100Learning.getWeights();



            weight=

            w.probability || 1;



        }






        return Number(

            (

            posterior

            *

            100

            *

            weight

            )

            .toFixed(3)

        );



    },









    // ==========================
    // 先验概率
    // ==========================


    priorProbability(

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






        return (

            count

            /

            history.length

        );



    },









    // ==========================
    // 近期证据
    // ==========================


    recentEvidence(

        number,

        history

    ){



        let recent=

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







        // 平滑处理


        return (

            count+1

        )

        /

        (

            recent.length+2

        );



    },









    // ==========================
    // 贝叶斯计算
    // ==========================


    calculate(

        prior,

        evidence

    ){



        let result=

        (

            prior

            *

            evidence

        )

        /

        (

            evidence

            ||

            1

        );







        return result;



    },









    // ==========================
    // 组合修正
    // ==========================


    combinationAdjust(

        front,

        history

    ){



        let total=0;




        front.forEach(n=>{


            total +=

            this.score(

                n,

                history

            );


        });





        return Number(

            total.toFixed(3)

        );



    }






};