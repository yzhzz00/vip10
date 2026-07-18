// models/monte.js


export class MonteModel {


    constructor(){


        this.name =
            "monte";


        this.simulations =
            1000000;


        this.samples=[];


    }



    // =========================
    // 随机整数
    // =========================

    randomInt(
        min,
        max
    ){


        return Math.floor(
            Math.random()
            *
            (max-min+1)
        )
        +min;


    }



    // =========================
    // 生成前区
    // =========================

    randomFront(){


        let set =
            new Set();



        while(
            set.size<5
        ){


            set.add(
                this.randomInt(
                    1,
                    35
                )
            );


        }



        return [
            ...set
        ]
        .sort(
            (a,b)=>a-b
        );


    }



    // =========================
    // 生成后区
    // =========================

    randomBack(){


        let set =
            new Set();



        while(
            set.size<2
        ){


            set.add(
                this.randomInt(
                    1,
                    12
                )
            );


        }



        return [
            ...set
        ]
        .sort(
            (a,b)=>a-b
        );


    }



    // =========================
    // 单组合评分
    // 结合委员会模型
    // =========================

    scoreCandidate(
        candidate,
        models=[]
    ){


        let score=0;



        models.forEach(
            model=>{


                let result =
                    model.predict(
                        candidate
                    );



                score +=
                    result.score;


            }
        );



        return score;


    }



    // =========================
    // 蒙特卡罗模拟
    // =========================

    simulate(
        models=[]
    ){


        this.samples=[];



        for(
            let i=0;
            i<this.simulations;
            i++
        ){


            let candidate={


                front:
                    this.randomFront(),


                back:
                    this.randomBack()


            };



            let score =
                this.scoreCandidate(
                    candidate,
                    models
                );



            this.samples.push({


                candidate,


                score


            });



        }



        return this.rank();


    }



    // =========================
    // 排序
    // =========================

    rank(){


        return this.samples
        .sort(
            (a,b)=>
            b.score-a.score
        )
        .slice(
            0,
            20
        );


    }



    // =========================
    // 模型预测接口
    // =========================

    predict(){


        let result =
            this.samples[0];



        if(!result){


            return {


                model:
                    this.name,


                score:0


            };


        }



        return {


            model:
                this.name,


            score:
                result.score,


            candidate:
                result.candidate


        };


    }



}