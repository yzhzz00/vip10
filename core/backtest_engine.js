/**
 * DLT-AI-CORE VIP
 * Backtest Engine V3.0 FINAL
 *
 * 历史滚动回测系统
 */


class BacktestEngine {



    constructor(){


        this.name =

        "backtest";



    }









    async run(

        history=[],

        periods=100

    ){



        if(

            history.length <= periods

        ){



            return {


                error:

                "历史数据不足"



            };



        }








        let total=0;


        let match3=0;


        let match4=0;


        let match5=0;


        let frontHit=0;








        const start =

        history.length

        -

        periods;








        for(

            let i=start;

            i<history.length-1;

            i++

        ){



            const real =

            history[i+1];





            /*
             * 使用历史前面数据
             */


            const trainData =

            history.slice(

                0,

                i+1

            );







            const predict =

            this.simplePredict(

                trainData

            );








            const hit =

            this.compare(

                predict,

                real.front

            );







            total++;







            if(

                hit>=3

            ){

                match3++;

            }





            if(

                hit>=4

            ){

                match4++;

            }






            if(

                hit===5

            ){

                match5++;

            }





            frontHit += hit;



        }







        return {



            model:

            this.name,



            period:

            periods,



            tests:

            total,



            hit3:

            match3,



            hit4:

            match4,



            hit5:

            match5,



            averageHit:

            Number(

                (

                frontHit /

                total

                )

                .toFixed(3)

            )



        };



    }









    simplePredict(

        history

    ){



        const count={};





        for(

            let i=1;

            i<=35;

            i++

        ){


            count[i]=0;


        }








        history.forEach(

            item=>{



                item.front

                .forEach(

                    n=>{


                        count[n]++;


                    }

                );



            }

        );







        return Object.keys(

            count

        )

        .sort(

            (a,b)=>

            count[b]

            -

            count[a]

        )

        .slice(

            0,

            5

        )

        .map(

            Number

        )

        .sort(

            (a,b)=>

            a-b

        );



    }









    compare(

        predict,

        real

    ){



        let hit=0;





        predict.forEach(

            n=>{



                if(

                    real.includes(n)

                ){


                    hit++;


                }


            }

        );





        return hit;



    }





}



export default BacktestEngine;