// DLT-AI-CORE V11 FINAL
// core/score.js
// 综合评分系统
// 理论 + 模型 + 矩阵 + 委员会融合


import config from "../config.js";


class Score {


    constructor(){

        this.weights = {

            theory: 0.25,

            model: 0.35,

            matrix: 0.25,

            diversity: 0.15

        };


    }





    calculate(data){


        const {

            theory,

            models,

            matrix,

            committee


        } = data;



        const numbers = {};



        // =====================
        // 模型评分
        // =====================

        this.addModelScore(

            numbers,

            models.frequency,

            this.weights.model *
            config.models.frequency.weight

        );



        this.addModelScore(

            numbers,

            models.trend,

            this.weights.model *
            config.models.trend.weight

        );



        this.addModelScore(

            numbers,

            models.bayes,

            this.weights.model *
            config.models.bayes.weight

        );



        this.addModelScore(

            numbers,

            models.markov,

            this.weights.model *
            config.models.markov.weight

        );



        this.addModelScore(

            numbers,

            models.montecarlo,

            this.weights.model *
            config.models.montecarlo.weight

        );





        // =====================
        // 矩阵评分
        // =====================


        if(matrix){

            const frequency =

            matrix.frequencyMatrix
            ||
            {};



            const omission =

            matrix.omissionMatrix
            ||
            {};



            for(let n=1;n<=35;n++){


                numbers[n]=

                (numbers[n]||0)

                +

                (

                    (frequency[n]||0)
                    *
                    0.6

                    +

                    (omission[n]||0)
                    *
                    0.4

                )

                *

                this.weights.matrix;


            }

        }





        // =====================
        // 理论修正
        // =====================


        this.applyTheory(

            numbers,

            theory

        );





        // =====================
        // 委员会增强
        // =====================


        if(committee){


            for(const item of committee){


                const n =

                Number(item[0]);



                numbers[n] =

                (numbers[n]||0)

                +

                Number(item[1])

                *

                0.1;


            }


        }





        return Object.entries(numbers)

        .sort(
            (a,b)=>b[1]-a[1]
        );


    }







    addModelScore(target,list,weight){


        if(
            !Array.isArray(list)
        ){

            return;

        }



        for(
            let i=0;
            i<list.length;
            i++
        ){


            const n =

            Number(
                list[i][0]
            );



            const value =

            Number(
                list[i][1]
                ||
                0
            );



            const rankBonus =

            (list.length-i)
            /
            list.length;



            target[n]=

            (target[n]||0)

            +

            value

            *

            rankBonus

            *

            weight;


        }


    }







    applyTheory(score,theory){


        if(!theory){

            return;

        }



        // 奇偶结构奖励

        if(
            theory.oddEven
        ){


            const odd =

            theory.oddEven.odd;



            if(
                odd>=2 &&
                odd<=3
            ){


                for(let n=1;n<=35;n+=2){


                    score[n]=

                    (score[n]||0)

                    +

                    0.05;


                }


            }


        }





        // 和值范围修正

        if(
            theory.sum
        ){


            const sum =

            theory.sum.frontSum;



            if(
                sum>=80 &&
                sum<=130
            ){


                for(let n=1;n<=35;n++){


                    score[n]=

                    (score[n]||0)

                    +

                    0.02;


                }


            }


        }



    }






    generate(numbers){


        const sorted =

        numbers
        .slice(0,20);



        const result=[];



        while(
            result.length<5
        ){


            const index =

            Math.floor(

                Math.random()
                *
                sorted.length

            );



            const n =

            Number(
                sorted[index][0]
            );



            if(
                !result.includes(n)
            ){

                result.push(n);

            }


        }



        return result

        .sort(
            (a,b)=>a-b
        );


    }



}



export default Score;