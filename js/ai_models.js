window.V110_AI = {


    // ======================
    // 频率模型
    // ======================

    frequency(number, history){


        let count = 0;


        history.forEach(item=>{


            if(item.front.includes(number)){

                count++;

            }


        });



        return count / history.length * 100;


    },





    // ======================
    // 趋势模型
    // 最近50期
    // ======================

    trend(number, history){


        let recent =
        history.slice(-50);



        let count=0;


        recent.forEach(item=>{


            if(item.front.includes(number)){

                count++;

            }


        });



        return count / recent.length * 100;


    },






    // ======================
    // 遗漏模型
    // ======================

    missing(number,history){


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




        // 中间遗漏区间评分

        if(
            miss>=5 &&
            miss<=25
        ){

            return 80;

        }


        if(miss>25){

            return 60;

        }



        return 50;


    },







    // ======================
    // 大乐透结构理论
    // ======================

    structure(front){



        let score=100;



        // 奇偶

        let odd =
        front.filter(
            n=>n%2===1
        ).length;



        if(
            odd===0 ||
            odd===5
        ){

            score-=20;

        }




        // 三区

        let zone1=0;

        let zone2=0;

        let zone3=0;



        front.forEach(n=>{


            if(n<=12)
                zone1++;


            else if(n<=24)
                zone2++;


            else
                zone3++;


        });





        if(
            zone1===0 ||
            zone2===0 ||
            zone3===0
        ){

            score-=15;

        }




        // 和值

        let sum =
        front.reduce(
            (a,b)=>a+b,
            0
        );



        if(
            sum<60 ||
            sum>150
        ){

            score-=10;

        }



        return score;


    },









    // ======================
    // 共现矩阵
    // ======================

    matrixScore(front,history){



        let matrix={};



        history.forEach(item=>{


            item.front.forEach(a=>{


                if(!matrix[a]){

                    matrix[a]={};

                }



                item.front.forEach(b=>{


                    if(a!==b){


                        matrix[a][b]
                        =
                        (matrix[a][b]||0)+1;


                    }


                });



            });



        });




        let score=0;



        front.forEach(a=>{


            front.forEach(b=>{


                if(
                    matrix[a] &&
                    matrix[a][b]
                ){


                    score+=
                    matrix[a][b];


                }


            });


        });




        return score/10;


    },








    // ======================
    // Markov 转移
    // ======================

    markov(number,history){


        if(history.length<2){

            return 0;

        }



        let last =
        history[history.length-1];



        let before =
        history[history.length-2];



        let score=0;



        if(
            before.front.includes(number)
        ){

            score+=20;

        }



        if(
            last.front.includes(number)
        ){

            score+=30;

        }



        return score;


    },







    // ======================
    // Bayes融合
    // ======================

    bayes(number,history){


        let p1=
        this.frequency(
            number,
            history
        );



        let p2=
        this.trend(
            number,
            history
        );



        return p1*0.4+p2*0.6;


    },







    // ======================
    // 反人类习惯模型
    // 降低大众喜欢组合
    // ======================

    antiHuman(front){



        let score=0;



        // 太多生日号

        let birthday =
        front.filter(
            n=>n<=31
        ).length;



        if(
            birthday===5
        ){

            score-=5;

        }



        // 连续号码

        for(
            let i=0;
            i<front.length-1;
            i++
        ){


            if(
                front[i+1]-front[i]===1
            ){

                score-=3;

            }


        }



        return score;


    },








    // ======================
    // 单号码最终评分
    // ======================

    numberScore(number,history){



        return (

            this.frequency(number,history)*0.2

            +

            this.trend(number,history)*0.2

            +

            this.missing(number,history)*0.15

            +

            this.bayes(number,history)*0.15

            +

            this.markov(number,history)*0.1


        );



    }



};