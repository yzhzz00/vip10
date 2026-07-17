// DLT-AI-CORE VIP
// core/candidate.js
//
// 候选组合生成模块
//
// 作用:
// 根据模型评分生成候选号码池
//
// 流程:
// 六大模型评分
// ↓
// 前区候选池
// ↓
// 后区候选池
// ↓
// 组合生成


import CONFIG from "../config.js";



class CandidateGenerator {


    constructor(){


        this.frontPool=[];

        this.backPool=[];

        this.candidates=[];


    }









    // ======================
    // 构建候选池
    // ======================

    buildPool(models){



        this.frontPool=[];

        this.backPool=[];






        for(

            let i=1;

            i<=35;

            i++

        ){



            let score=

            this.numberScore(

                i,

                models,

                "front"

            );





            this.frontPool.push({


                number:i,


                score



            });


        }








        for(

            let i=1;

            i<=12;

            i++

        ){



            let score=

            this.numberScore(

                i,

                models,

                "back"

            );





            this.backPool.push({


                number:i,


                score



            });



        }








        this.frontPool.sort(

            (a,b)=>

            b.score-a.score

        );





        this.backPool.sort(

            (a,b)=>

            b.score-a.score

        );








        this.frontPool=

        this.frontPool.slice(

            0,

            CONFIG.CANDIDATE.poolFront

        );





        this.backPool=

        this.backPool.slice(

            0,

            CONFIG.CANDIDATE.poolBack

        );







        return {


            front:this.frontPool,


            back:this.backPool



        };


    }









    // ======================
    // 综合号码评分
    // ======================

    numberScore(

        num,

        models,

        type

    ){



        let score=0;






        if(type==="front"){



            score +=

            models.frequency

            .getFrontScore(num);



            score +=

            models.trend

            .getFrontScore(num);



            score +=

            models.bayes

            .getFrontScore(num);



            score +=

            models.omission

            .getFrontScore(num);



            score +=

            models.cycle

            .getFrontScore(num);



        }

        else{



            score +=

            models.frequency

            .getBackScore(num);



            score +=

            models.trend

            .getBackScore(num);



            score +=

            models.bayes

            .getBackScore(num);



            score +=

            models.omission

            .getBackScore(num);



            score +=

            models.cycle

            .getBackScore(num);



        }






        return Number(

            score.toFixed(2)

        );


    }









    // ======================
    // 生成组合
    // ======================

    generate(){



        this.candidates=[];







        let count=

        CONFIG.CANDIDATE.generateCount;






        while(

            this.candidates.length

            <

            count

        ){



            let front=

            this.randomSelect(

                this.frontPool,

                5

            );





            let back=

            this.randomSelect(

                this.backPool,

                2

            );







            if(

                this.checkDuplicate(

                    front,

                    back

                )

            )

                continue;







            this.candidates.push({


                front,


                back



            });



        }







        return this.candidates;


    }









    // ======================
    // 随机抽取
    // ======================

    randomSelect(

        pool,

        count

    ){



        let arr=

        [

            ...pool

        ];






        arr.sort(

            ()=>Math.random()-0.5

        );







        return arr

        .slice(

            0,

            count

        )

        .map(

            x=>x.number

        )

        .sort(

            (a,b)=>a-b

        );


    }









    // ======================
    // 去重
    // ======================

    checkDuplicate(

        front,

        back

    ){



        return this.candidates.some(

            item=>


            JSON.stringify(

                item.front

            )

            ===

            JSON.stringify(

                front

            )

            &&


            JSON.stringify(

                item.back

            )

            ===

            JSON.stringify(

                back

            )


        );


    }









    status(){



        return {


            frontPool:

            this.frontPool.length,



            backPool:

            this.backPool.length,



            candidates:

            this.candidates.length



        };


    }



}



export default new CandidateGenerator();