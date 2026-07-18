// core/montecarlo.js


export class MonteCarloEngine {


    constructor(){


        this.iterations =
            1000000;


        this.results=[];


        this.progress=0;


    }



    // =========================
    // 随机整数
    // =========================

    random(
        min,
        max
    ){


        return Math.floor(

            Math.random()
            *
            (
                max-min+1
            )

        )
        +min;


    }




    // =========================
    // 生成前区
    // =========================

    createFront(){


        let set =
            new Set();



        while(
            set.size<5
        ){


            set.add(

                this.random(
                    1,
                    35
                )

            );


        }



        return [

            ...set

        ]
        .sort(
            (a,b)=>
            a-b
        );


    }





    // =========================
    // 生成后区
    // =========================

    createBack(){


        let set =
            new Set();



        while(
            set.size<2
        ){


            set.add(

                this.random(
                    1,
                    12
                )

            );


        }



        return [

            ...set

        ]
        .sort(
            (a,b)=>
            a-b
        );


    }





    // =========================
    // 候选生成
    // =========================

    generate(){


        return {


            front:
            this.createFront(),


            back:
            this.createBack()


        };


    }





    // =========================
    // 模型综合评分
    // =========================

    evaluate(
        candidate,
        models,
        context={}
    ){


        let score=0;



        models.forEach(
            model=>{


                let result =
                    model.predict(
                        candidate,
                        context
                    );



                score +=
                    result.score
                    ||
                    0;


            }
        );



        return score
        /
        models.length;


    }





    // =========================
    // 开始模拟
    // =========================

    run(
        models=[],
        context={},
        callback=null
    ){


        this.results=[];



        for(
            let i=0;

            i<this.iterations;

            i++
        ){


            let candidate =
                this.generate();



            let score =
                this.evaluate(
                    candidate,
                    models,
                    context
                );



            this.results.push({


                candidate,


                score



            });



            if(
                i%10000===0
            ){


                this.progress =
                (
                    i
                    /
                    this.iterations
                )
                *
                100;



                if(callback){

                    callback(
                        this.progress
                    );

                }


            }


        }



        return this.rank();


    }





    // =========================
    // 排序
    // =========================

    rank(){


        return this.results

        .sort(

            (a,b)=>

            b.score-a.score

        )

        .slice(
            0,
            50
        );


    }





    // =========================
    // 状态
    // =========================

    status(){


        return {


            progress:
            this.progress,


            count:
            this.results.length


        };


    }



}