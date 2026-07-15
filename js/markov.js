// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// markov.js
// 一阶马尔可夫转移模型
// ==================================================

"use strict";


window.V100Markov = {


    frontMatrix:{},


    backMatrix:{},


    trained:false,




    // ==========================
    // 训练转移矩阵
    // ==========================


    train(history){



        this.frontMatrix={};

        this.backMatrix={};




        for(
            let i=0;

            i<history.length-1;

            i++

        ){



            let current=

            history[i];



            let next=

            history[i+1];






            // 前区转移


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








            // 后区转移


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





        this.trained=true;



        console.log(

            "Markov训练完成"

        );



    },









    // ==========================
    // 前区号码转移评分
    // ==========================


    frontScore(

        number,

        lastFront

    ){



        if(
            !this.trained
        ){

            return 0;

        }





        let score=0;




        lastFront.forEach(last=>{



            let map=

            this.frontMatrix[last];





            if(
                map
                &&
                map[number]
            ){


                score +=

                map[number];



            }



        });






        return score;



    },









    // ==========================
    // 后区评分
    // ==========================


    backScore(

        number,

        lastBack

    ){



        if(
            !this.trained
        ){

            return 0;

        }





        let score=0;




        lastBack.forEach(last=>{



            let map=

            this.backMatrix[last];





            if(
                map
                &&
                map[number]
            ){


                score +=

                map[number];

            }



        });





        return score;



    },









    // ==========================
    // 输出报告
    // ==========================


    report(){



        return {



            trained:

            this.trained,



            frontStates:

            Object.keys(
                this.frontMatrix
            ).length,



            backStates:

            Object.keys(
                this.backMatrix
            ).length



        };



    }




};