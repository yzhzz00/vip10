// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// model.js
// AI综合模型入口
// ==================================================

"use strict";


window.V100Model = {


    version:"V100.1",



    analyzeNumber(number, history){


        let score = 0;



        // 趋势模型

        if(window.V100Trend){


            score +=

            V100Trend.score(
                number,
                history
            )
            *
            this.getWeight("trend");


        }






        // Bayes模型

        if(window.V100Bayes){


            score +=

            V100Bayes.score(
                number,
                history
            )
            *
            this.getWeight("bayes");


        }






        // Markov模型

        if(window.V100Markov){


            let last =

            history[
                history.length-1
            ];



            if(last){


                score +=

                V100Markov.frontScore(
                    number,
                    last.front
                )
                *
                this.getWeight("markov");


            }


        }






        return Number(

            score.toFixed(3)

        );


    },








    getWeight(name){



        if(
            window.V100Learning
        ){



            let w =

            V100Learning.getWeights();



            return w[name] || 1;



        }



        return 1;



    }




};