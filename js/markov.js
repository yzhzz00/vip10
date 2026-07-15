// ==================================================
// 大乐透 AI V100 CORE FINAL
// markov.js
// 一阶马尔可夫转移模型
// ==================================================

"use strict";


window.V100Markov = {



    frontMatrix:{},

    backMatrix:{},



    // ==============================
    // 建立转移矩阵
    // ==============================


    train(history){


        this.frontMatrix={};

        this.backMatrix={};



        for(
            let i=0;
            i<history.length-1;
            i++
        ){


            let current =
            history[i];


            let next =
            history[i+1];



            // 前区


            current.front.forEach(a=>{


                if(
                    !this.frontMatrix[a]
                ){

                    this.frontMatrix[a]={};

                }



                next.front.forEach(b=>{


                    if(
                        !this.frontMatrix[a][b]
                    ){

                        this.frontMatrix[a][b]=0;

                    }


                    this.frontMatrix[a][b]++;


                });


            });





            // 后区


            current.back.forEach(a=>{


                if(
                    !this.backMatrix[a]
                ){

                    this.backMatrix[a]={};

                }




                next.back.forEach(b=>{


                    if(
                        !this.backMatrix[a][b]
                    ){

                        this.backMatrix[a][b]=0;

                    }


                    this.backMatrix[a][b]++;



                });



            });



        }



        this.normalize();


    },








    // ==============================
    // 概率化
    // ==============================


    normalize(){



        for(
            let a in this.frontMatrix
        ){



            let total=0;



            for(
                let b in this.frontMatrix[a]
            ){

                total +=
                this.frontMatrix[a][b];

            }





            for(
                let b in this.frontMatrix[a]
            ){

                this.frontMatrix[a][b]
                =
                Number(

                (
                this.frontMatrix[a][b]
                /
                total

                )
                .toFixed(4)

                );


            }


        }






        for(
            let a in this.backMatrix
        ){



            let total=0;



            for(
                let b in this.backMatrix[a]
            ){

                total +=
                this.backMatrix[a][b];

            }




            for(
                let b in this.backMatrix[a]
            ){


                this.backMatrix[a][b]
                =
                Number(

                (
                this.backMatrix[a][b]
                /
                total

                )
                .toFixed(4)

                );


            }


        }



    },









    // ==============================
    // 获取下一期转移评分
    // ==============================


    frontScore(
        number,
        lastNumbers
    ){


        let score=0;



        lastNumbers.forEach(last=>{


            if(
                this.frontMatrix[last]
                &&
                this.frontMatrix[last][number]
            ){


                score +=

                this.frontMatrix[last][number];


            }



        });



        return Number(

            score.toFixed(4)

        );



    },









    backScore(
        number,
        lastNumbers
    ){


        let score=0;



        lastNumbers.forEach(last=>{


            if(

                this.backMatrix[last]

                &&

                this.backMatrix[last][number]

            ){


                score +=

                this.backMatrix[last][number];


            }



        });



        return Number(

            score.toFixed(4)

        );



    },








    // ==============================
    // 报告
    // ==============================


    report(){


        return {


            front:

            Object.keys(
                this.frontMatrix
            )
            .length,



            back:

            Object.keys(
                this.backMatrix
            )
            .length


        };


    }





};