/**
 * DLT-AI-CORE VIP
 * Monte Carlo Engine V2.0
 *
 * 大乐透组合模拟引擎
 */



class MonteCarloEngine {



    constructor(){


        this.defaultTimes =
        1000000;


    }









    run(

        frontPool=[],

        backPool=[],

        times=this.defaultTimes

    ){



        const results=[];



        for(

            let i=0;

            i<times;

            i++

        ){



            const front =

            this.weightPick(

                frontPool,

                5

            )

            .sort(

                (a,b)=>a-b

            );






            const back =

            this.weightPick(

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







            results.push({


                front,


                back,


                score:

                this.score(

                    frontPool,

                    front

                )



            });



        }







        return this.rank(

            results

        );



    }









    // =====================
    // 权重随机
    // =====================


    weightPick(

        pool,

        count

    ){



        const result=[];



        const copy =
        [...pool];





        while(

            result.length<count

        ){



            const total =

            copy.reduce(

                (

                    sum,

                    item

                )=>

                    sum +

                    Math.max(

                        item.score,

                        0.1

                    ),

                0

            );






            let random =

            Math.random()

            *

            total;





            let index=0;





            for(

                let i=0;

                i<copy.length;

                i++

            ){



                random -=

                Math.max(

                    copy[i].score,

                    0.1

                );



                if(

                    random<=0

                ){


                    index=i;

                    break;


                }


            }







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









    // =====================
    // 结构过滤
    // =====================


    checkStructure(

        nums

    ){



        const odd =

        nums.filter(

            n=>n%2

        )

        .length;





        if(

            odd<1

            ||

            odd>4

        ){

            return false;

        }






        const sum =

        nums.reduce(

            (a,b)=>a+b,

            0

        );






        if(

            sum<70

            ||

            sum>160

        ){

            return false;

        }







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









    score(

        pool,

        nums

    ){



        let score=0;





        nums.forEach(

            n=>{



                const item=

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

            score.toFixed(3)

        );



    }









    rank(

        list

    ){



        const map={};




        list.forEach(

            item=>{


                const key =

                JSON.stringify(

                    item.front

                )

                +

                JSON.stringify(

                    item.back

                );





                if(

                    !map[key]

                    ||

                    map[key].score

                    <

                    item.score

                ){

                    map[key]=item;

                }



            }

        );





        return Object.values(

            map

        )

        .sort(

            (a,b)=>

            b.score-a.score

        )

        .slice(

            0,

            50

        );



    }





}





export default MonteCarloEngine;