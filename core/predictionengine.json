// 大乐透AI_V90
// Prediction Engine
// 预测生成引擎


window.PredictionEngine = {


    candidates: [],


    result: null,





    init(){


        this.candidates=[];

        this.result=null;


        console.log(
            "PredictionEngine初始化完成"
        );


    },







    // 生成预测


    async generate(
        models={}
    ){



        this.candidates=[];




        let pool =

        this.createPool(
            models
        );





        for(
            let item of pool
        ){


            let score =

            this.scoreCandidate(
                item,
                models
            );



            this.candidates.push({


                front:
                item.front,


                back:
                item.back,


                score


            });



        }





        this.candidates.sort(
            (
                a,b
            )=>

            b.score-a.score

        );





        this.result = {


            top:

            this.candidates.slice(
                0,
                10
            ),



            time:
            new Date()
            .toISOString()


        };





        return this.result;



    },









    // 创建候选池


    createPool(
        models
    ){



        let pool=[];




        // 如果蒙特卡罗有结果

        if(
            models.montecarlo
        ){



            models.montecarlo
            .forEach(
                item=>{


                    pool.push({


                        front:
                        item.front,


                        back:
                        item.back



                    });


                }
            );



        }






        // 没有模拟结果时生成基础候选


        if(
            pool.length===0
        ){



            for(
                let i=0;
                i<100;
                i++
            ){



                pool.push({


                    front:
                    this.random(
                        35,
                        5
                    ),



                    back:
                    this.random(
                        12,
                        2
                    )



                });



            }



        }




        return pool;



    },









    // 综合评分


    scoreCandidate(
        item,
        models
    ){



        let score=0;



        // 基础随机评分

        score += Math.random()*20;




        // 理论评分

        if(
            models.theory
        ){


            score +=

            this.theoryScore(
                item
            );


        }




        // 马尔可夫评分

        if(
            models.markov
        ){


            score +=

            this.markovScore(
                item,
                models.markov
            );


        }




        // 贝叶斯评分

        if(
            models.bayes
        ){


            score +=

            this.bayesScore(
                item,
                models.bayes
            );


        }



        return score;



    },









    theoryScore(item){


        let score=0;



        let sum =

        item.front.reduce(
            (
                a,b
            )=>a+b,
            0
        );



        if(
            sum>=80 &&
            sum<=150
        ){

            score+=20;

        }



        return score;



    },









    markovScore(
        item,
        markov
    ){


        return 10;


    },









    bayesScore(
        item,
        bayes
    ){


        return 10;


    },









    // 随机号码


    random(
        max,
        count
    ){



        let arr=[];



        while(
            arr.length<count
        ){



            let n =

            Math.floor(
                Math.random()*max
            )+1;



            if(
                !arr.includes(n)
            ){


                arr.push(n);


            }


        }




        return arr.sort(
            (
                a,b
            )=>
            a-b
        );


    },









    getResult(){


        return this.result;


    }



};