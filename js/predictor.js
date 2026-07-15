// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// predictor.js
// AI综合预测中心
// ==================================================

"use strict";


window.V100Predictor = {



    async analyze(history){



        if(
            !history ||
            history.length < 500
        ){

            throw new Error(
                "历史数据不足500期"
            );

        }







        // ==========================
        // Markov训练
        // ==========================


        if(
            window.V100Markov
        ){

            V100Markov.train(

                history

            );

        }









        let candidates=[];





        // ==========================
        // 号码评分
        // ==========================


        for(

            let i=1;

            i<=35;

            i++

        ){



            let score=

            V100Model.analyzeNumber(

                i,

                history

            );





            candidates.push({


                number:i,


                score



            });



        }








        // 排序取高分号码


        candidates.sort(

            (a,b)=>

            b.score-a.score

        );









        // ==========================
        // 生成组合池
        // ==========================


        let pool=

        this.createPool(

            candidates,

            history

        );







        // ==========================
        // 蒙特卡罗
        // ==========================


        let monteResult=

        await V100MonteCarlo.run(

            pool,

            100000

        );







        let final=



        {

            front:

            monteResult[0].front,


            back:

            monteResult[0].back,


            score:

            monteResult[0].hit



        };








        // 保存最后预测


        localStorage.setItem(

            "V100_LAST_RESULT",

            JSON.stringify(

                final

            )

        );






        return {



            final,


            top10:

            monteResult



        };




    },









    // ==========================
    // 创建候选组合池
    // ==========================


    createPool(

        numbers,

        history

    ){



        let result=[];






        let top=

        numbers.slice(

            0,

            15

        );







        for(

            let i=0;

            i<top.length;

            i++

        ){



            for(

                let j=i+1;

                j<top.length;

                j++

            ){



                let front=

                this.randomFront(

                    top

                );





                let check=

                V100Structure.check(

                    front

                );





                if(

                    check.pass

                ){



                    let back=

                    this.backPool(

                        history

                    );





                    result.push({


                        front,


                        back,


                        score:

                        check.score


                    });



                }



            }



        }





        return result.slice(

            0,

            1000

        );



    },









    // ==========================
    // 前区组合
    // ==========================


    randomFront(pool){



        let arr=pool

        .map(x=>x.number)

        .sort(

            ()=>Math.random()-0.5

        )

        .slice(

            0,

            5

        );





        return arr.sort(

            (a,b)=>a-b

        );



    },









    // ==========================
    // 后区生成
    // ==========================


    backPool(history){



        let scores=[];



        for(

            let i=1;

            i<=12;

            i++

        ){



            let score=

            0;



            if(

                V100Bayes

            ){


                score +=

                V100Bayes.score(

                    i,

                    history

                );

            }



            scores.push({

                number:i,

                score


            });



        }






        scores.sort(

            (a,b)=>

            b.score-a.score

        );





        return [

            scores[0].number,

            scores[1].number

        ].sort(

            (a,b)=>a-b

        );



    }







};