// core/backtest.js


export class BacktestEngine {


    constructor(){


        this.results=[];


    }





    // =====================
    // 单期测试
    // =====================

    test(
        target,
        predictions
    ){


        let best =
        predictions[0];



        if(
            !best
        ){

            return {


                hit:false,


                front:0,


                back:0


            };

        }





        let frontHit =

        best.candidate.front
        .filter(
            n=>

            target.front
            .includes(n)

        )
        .length;



        let backHit =

        best.candidate.back
        .filter(
            n=>

            target.back
            .includes(n)

        )
        .length;





        return {


            hit:

            frontHit>=3
            ||
            backHit>=1,



            front:

            frontHit,



            back:

            backHit



        };



    }





    // =====================
    // 滚动回测
    // =====================

    run(
        history,
        predictor,
        start=100
    ){


        this.results=[];



        for(
            let i=start;

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





            let predictions =

            predictor(
                train
            );



            let result =

            this.test(
                target,
                predictions
            );



            this.results.push({

                period:i,


                result


            });



        }



        return this.report();


    }





    // =====================
    // 报告
    // =====================

    report(){


        let total =

        this.results.length;



        let hit =

        this.results
        .filter(
            x=>
            x.result.hit
        )
        .length;



        let avgFront=0;

        let avgBack=0;



        this.results.forEach(
        x=>{


            avgFront +=

            x.result.front;



            avgBack +=

            x.result.back;



        });





        return {


            total,


            hit,


            rate:

            total
            ?
            (
                hit/total*100
            )
            .toFixed(2)
            :
            0,



            avgFront:

            total
            ?
            (
                avgFront/total
            )
            .toFixed(2)
            :
            0,



            avgBack:

            total
            ?
            (
                avgBack/total
            )
            .toFixed(2)
            :
            0,



            details:

            this.results



        };



    }



}