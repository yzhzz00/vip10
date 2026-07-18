// core/backtest.js


export class BacktestEngine {


    constructor(){


        this.results=[];


    }



    // =========================
    // 单期回测
    // =========================

    testOne(
        trainData,
        target,
        system
    ){


        let prediction =
            system.predict();



        let top3 =
            prediction.slice(
                0,
                3
            );



        let hit=0;



        top3.forEach(
            item=>{


                let frontHit =
                    item.candidate.front
                    .filter(
                        n=>
                        target.front
                        .includes(n)
                    )
                    .length;



                let backHit =
                    item.candidate.back
                    .filter(
                        n=>
                        target.back
                        .includes(n)
                    )
                    .length;



                if(
                    frontHit>=3 ||
                    backHit>=1
                ){

                    hit++;

                }



            }
        );



        return {


            period:
                target,


            hit,


            prediction:
                top3


        };


    }





    // =========================
    // 滚动回测
    // =========================

    rolling(
        history,
        trainSize,
        system
    ){


        this.results=[];



        for(
            let i=trainSize;
            i<history.length;
            i++
        ){


            let train =
                history.slice(
                    0,
                    i
                );



            let target =
                history[i];



            if(
                system.train
            ){

                system.train(
                    train
                );

            }



            let result =
                this.testOne(
                    train,
                    target,
                    system
                );



            this.results.push(
                result
            );


        }



        return this.report();


    }





    // =========================
    // 报告
    // =========================

    report(){


        let total =
            this.results.length;



        let hit =
            this.results
            .filter(
                r=>
                r.hit>0
            )
            .length;



        return {


            total,


            hit,


            rate:
            total===0
            ?
            0
            :
            (
                hit/total
            )
            .toFixed(4),


            details:
                this.results


        };


    }



}