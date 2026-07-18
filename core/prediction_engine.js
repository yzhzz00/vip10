/**
 * DLT-AI-CORE VIP
 * Prediction Engine V3.0
 *
 * 多模型组合预测
 */


class PredictionEngine {


    constructor(
        modelResult={}
    ){


        this.models =
        modelResult.models
        ||
        modelResult
        ||
        {};


    }





    async predict(){



        const frontPool =
        this.buildFrontPool();



        const backPool =
        this.buildBackPool();



        const candidates =
        this.monteCarlo(

            frontPool,

            backPool,

            100000

        );



        return {


            engine:
            "prediction_v3",


            time:
            new Date()
            .toISOString(),


            predictions:

            candidates.slice(
                0,
                3
            )


        };



    }








    // ======================
    // 前区综合评分
    // ======================

    buildFrontPool(){


        const scores={};



        for(
            let i=1;
            i<=35;
            i++
        ){

            scores[i]=0;

        }





        Object.values(
            this.models
        )
        .forEach(
            model=>{


                if(
                    !model
                    ||
                    !model.numbers
                ){

                    return;

                }




                model.numbers
                .forEach(
                    item=>{


                        scores[item.number]
                        +=
                        Number(
                            item.score
                        )
                        ||
                        0;


                    }
                );


            }

        );





        return Object.keys(
            scores
        )
        .map(
            n=>({


                number:
                Number(n),


                score:
                scores[n]


            })

        )

        .sort(
            (a,b)=>
            b.score-a.score
        )

        .slice(
            0,
            20
        );


    }







    // ======================
    // 后区评分
    // ======================

    buildBackPool(){



        const result=[];



        for(
            let i=1;
            i<=12;
            i++
        ){


            let score=0;



            Object.values(
                this.models
            )
            .forEach(
                model=>{


                    if(
                        model.back
                    ){

                        score +=
                        model.back[i]
                        ||
                        0;

                    }


                }
            );



            result.push({

                number:i,


                score:

                score

            });



        }



        /*
        如果模型没有后区数据
        使用基础概率
        */


        return result.map(

            x=>{


                if(
                    x.score===0
                ){

                    x.score =
                    Math.random();

                }


                return x;


            }

        )

        .sort(

            (a,b)=>
            b.score-a.score

        )

        .slice(
            0,
            8
        );


    }








    // ======================
    // Monte Carlo筛选
    // ======================


    monteCarlo(

        frontPool,

        backPool,

        count

    ){



        const result=[];



        for(
            let i=0;
            i<count;
            i++
        ){


            const front =

            this.randomPick(

                frontPool,

                5

            )

            .sort(
                (a,b)=>a-b
            );




            const back =

            this.randomPick(

                backPool,

                2

            )

            .sort(
                (a,b)=>a-b
            );





            if(
                !this.checkStructure(
                    front
                )
            ){

                continue;

            }




            result.push({


                front,


                back,


                score:

                this.scoreCombination(

                    frontPool,

                    front

                )



            });



        }







        return result.sort(

            (a,b)=>

            b.score-a.score

        )

        .filter(

            (item,index,array)=>{


                return index===

                array.findIndex(

                    x=>

                    JSON.stringify(
                        x.front
                    )

                    ===

                    JSON.stringify(
                        item.front
                    )

                );


            }

        );


    }









    // ======================
    // 结构过滤
    // ======================


    checkStructure(nums){



        // 奇偶

        const odd =

        nums.filter(

            n=>n%2

        ).length;




        if(
            odd<1
            ||
            odd>4
        ){

            return false;

        }





        // 和值

        const sum =

        nums.reduce(

            (a,b)=>a+b,

            0

        );



        if(
            sum<70
            ||
            sum>150
        ){

            return false;

        }





        // 跨度


        const span =

        nums[4]
        -
        nums[0];



        if(
            span<10
            ||
            span>34
        ){

            return false;

        }



        return true;



    }









    scoreCombination(

        pool,

        nums

    ){



        let score=0;



        nums.forEach(

            n=>{


                const item =

                pool.find(

                    x=>

                    x.number===n

                );



                if(item){

                    score +=
                    item.score;

                }


            }

        );



        return Number(

            score.toFixed(2)

        );



    }









    randomPick(

        pool,

        count

    ){


        const copy =
        [...pool];


        const result=[];



        while(
            result.length<count
        ){



            const index =

            Math.floor(

                Math.random()
                *
                copy.length

            );



            result.push(

                copy[index].number

            );



            copy.splice(

                index,

                1

            );


        }



        return result;



    }



}



export default PredictionEngine;