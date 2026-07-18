// core/montecarlo.js


export class MonteCarloEngine {


    constructor(){


        this.total =
        1000000;


        this.batch =
        5000;


        this.results=[];


        this.running=false;


        this.progress=0;


    }





    // =====================
    // 随机数
    // =====================

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
        +
        min;


    }





    // =====================
    // 生成前区
    // =====================

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



        return [...set]
        .sort(
            (a,b)=>
            a-b
        );


    }





    // =====================
    // 生成后区
    // =====================

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



        return [...set]
        .sort(
            (a,b)=>
            a-b
        );


    }





    // =====================
    // 候选生成
    // =====================

    generate(){


        return {


            front:
            this.createFront(),



            back:
            this.createBack()



        };


    }





    // =====================
    // 评分
    // =====================

    evaluate(
        candidate,
        models,
        theory
    ){


        let score=0;



        models.forEach(
        model=>{


            let result =
            model.predict(
                candidate
            );



            score +=

            result.score
            ||
            0;



        });





        if(theory){


            score +=

            theory.score(
                candidate
            )
            *
            10;



        }




        return score;



    }





    // =====================
    // 异步运行
    // =====================

    run(
        models,
        theory,
        onProgress,
        onFinish
    ){


        this.results=[];


        this.running=true;


        let current=0;



        const loop=()=>{


            let count=0;



            while(
                count<this.batch
                &&
                current<this.total
            ){


                let candidate =
                this.generate();



                let score =

                this.evaluate(
                    candidate,
                    models,
                    theory
                );



                this.results.push({

                    candidate,

                    score


                });



                current++;

                count++;


            }





            this.progress =

            (
                current
                /
                this.total
            )
            *
            100;



            if(onProgress){


                onProgress(
                    this.progress
                );


            }





            if(
                current<this.total
            ){


                setTimeout(
                    loop,
                    0
                );


            }
            else{


                this.running=false;



                let result =

                this.results

                .sort(
                (a,b)=>

                    b.score
                    -
                    a.score

                )

                .slice(
                    0,
                    50
                );



                if(onFinish){


                    onFinish(
                        result
                    );


                }


            }



        };



        loop();



    }





    status(){


        return {


            running:

            this.running,


            progress:

            this.progress,


            count:

            this.results.length



        };


    }



}