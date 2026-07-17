// DLT-AI-CORE VIP
// core/score.js
//
// 综合评分模块
//
// 作用:
// 将多模型结果融合
//
// 评分:
// 1.频率模型
// 2.趋势模型
// 3.贝叶斯模型
// 4.马尔可夫模型
// 5.遗漏模型
// 6.周期模型
// 7.结构评分


import CONFIG from "../config.js";



class ScoreEngine {



    constructor(){


        this.results=[];


    }









    // ======================
    // 对候选评分
    // ======================

    evaluate(

        candidates,

        models,

        history

    ){



        this.results=[];







        candidates.forEach(item=>{



            let score=0;







            // 六大模型融合

            score +=

            this.frequencyScore(

                item,

                models

            )

            *

            CONFIG.MODEL_WEIGHT.frequency;







            score +=

            this.trendScore(

                item,

                models

            )

            *

            CONFIG.MODEL_WEIGHT.trend;







            score +=

            this.bayesScore(

                item,

                models

            )

            *

            CONFIG.MODEL_WEIGHT.bayes;







            score +=

            this.markovScore(

                item,

                models,

                history

            )

            *

            CONFIG.MODEL_WEIGHT.markov;







            score +=

            this.omissionScore(

                item,

                models

            )

            *

            CONFIG.MODEL_WEIGHT.omission;







            score +=

            this.cycleScore(

                item,

                models

            )

            *

            CONFIG.MODEL_WEIGHT.cycle;







            // 结构奖励

            score +=

            this.structureScore(

                item.front

            );







            this.results.push({


                front:

                item.front,


                back:

                item.back,



                score:

                Number(

                    score.toFixed(4)

                )



            });




        });







        return this.sort();


    }









    // ======================
    // 频率评分
    // ======================

    frequencyScore(

        item,

        models

    ){



        let score=0;



        item.front.forEach(n=>{


            score+=

            models.frequency

            .getFrontScore(n);



        });



        item.back.forEach(n=>{


            score+=

            models.frequency

            .getBackScore(n);



        });



        return score;


    }









    trendScore(

        item,

        models

    ){



        return this.commonScore(

            item,

            models.trend

        );


    }









    bayesScore(

        item,

        models

    ){



        return this.commonScore(

            item,

            models.bayes

        );


    }









    omissionScore(

        item,

        models

    ){



        return this.commonScore(

            item,

            models.omission

        );


    }









    cycleScore(

        item,

        models

    ){



        return this.commonScore(

            item,

            models.cycle

        );


    }









    commonScore(

        item,

        model

    ){



        let score=0;



        item.front.forEach(n=>{


            score+=

            model.getFrontScore(n);



        });




        item.back.forEach(n=>{


            score+=

            model.getBackScore(n);



        });




        return score;


    }









    // ======================
    // 马尔可夫评分
    // ======================

    markovScore(

        item,

        models,

        history

    ){



        return models.markov.evaluate(

            item.front,

            item.back,

            history

        );


    }









    // ======================
    // 结构评分
    // ======================

    structureScore(front){



        let score=0;



        let sum=

        front.reduce(

            (a,b)=>a+b,

            0

        );





        if(

            sum>=80

            &&

            sum<=120

        )

            score+=20;





        let odd=

        front.filter(

            n=>n%2

        ).length;





        if(

            odd===2

            ||

            odd===3

        )

            score+=20;





        return score;


    }









    // ======================
    // 排序
    // ======================

    sort(){



        return this.results.sort(

            (a,b)=>

            b.score-a.score

        );


    }









    status(){



        return {


            count:

            this.results.length



        };


    }



}



export default new ScoreEngine();