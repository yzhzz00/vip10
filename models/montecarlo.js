// DLT-AI-CORE V11 FINAL
// models/montecarlo.js
// 蒙特卡罗模拟模型


class MonteCarloModel {


    constructor(){


        this.name =
        "montecarlo";


        this.simulations =
        100000;


    }









    async train(history){


        this.history =
        history;



        return true;


    }









    async predict(features){


        const frontCount =
        {};



        const backCount =
        {};



        for(
            let i=0;
            i<this.simulations;
            i++
        ){


            const front =
            this.randomNumbers(
                35,
                5
            );



            const back =
            this.randomNumbers(
                12,
                2
            );



            front.forEach(
                n=>{


                    frontCount[n]
                    =
                    (
                        frontCount[n]
                        ||
                        0
                    )
                    +1;


                }
            );



            back.forEach(
                n=>{


                    backCount[n]
                    =
                    (
                        backCount[n]
                        ||
                        0
                    )
                    +1;


                }
            );


        }



        return {


            front:
            this.top(
                frontCount,
                10
            ),


            back:
            this.top(
                backCount,
                5
            ),


            scores:{


                front:
                frontCount,


                back:
                backCount



            }



        };


    }









    randomNumbers(
        max,
        count
    ){


        const set =
        new Set();



        while(
            set.size<count
        ){


            set.add(

                Math.floor(
                    Math.random()
                    *
                    max
                )
                +1

            );


        }



        return Array.from(
            set
        );


    }









    top(
        data,
        count
    ){


        return Object.entries(
            data
        )
        .sort(
            (a,b)=>

            b[1]-a[1]

        )
        .slice(
            0,
            count
        )
        .map(
            item=>

            Number(
                item[0]
            )

        )
        .sort(
            (a,b)=>

            a-b

        );


    }



}



export default MonteCarloModel;