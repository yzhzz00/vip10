// DLT-AI-CORE V11 FINAL
// core/backtest.js
// 历史回测系统
// 验证模型长期表现


class Backtest {


    constructor(){

        this.results = [];

    }





    run(history, engine, periods=[100,500,1000]){


        const output = {};



        for(const period of periods){


            const result =

            this.testPeriod(
                history,
                engine,
                period
            );



            output[period]=result;


        }



        this.results.push(output);



        return output;


    }





    testPeriod(history, engine, period){


        if(history.length <= period){

            return {

                error:
                "历史数据不足"

            };

        }



        let total=0;


        let hit3=0;


        let hit4=0;


        let hit5=0;


        let backHit=0;



        const start =

        history.length-period;



        for(
            let i=start;
            i<history.length-1;
            i++
        ){



            const train =

            history.slice(
                0,
                i
            );



            const real =

            history[i];



            const prediction =

            engine.quickPredict(
                train
            );



            if(
                !prediction
            ){

                continue;

            }



            const match =

            prediction.front
            .filter(

                n=>

                real.front.includes(n)

            )
            .length;



            const back =

            prediction.back
            .filter(

                n=>

                real.back.includes(n)

            )
            .length;



            total++;



            if(match>=3){

                hit3++;

            }


            if(match>=4){

                hit4++;

            }


            if(match===5){

                hit5++;

            }


            if(back>=1){

                backHit++;

            }



        }





        return {


            period,


            samples:

            total,


            front3:

            hit3,


            front4:

            hit4,


            front5:

            hit5,


            back:

            backHit,


            rate:


            Number(

                (

                    hit3 /

                    Math.max(total,1)

                    *

                    100

                )

                .toFixed(2)

            )


        };


    }





    compare(results){


        const ranking = [];



        for(const period in results){


            ranking.push({

                period,


                score:

                results[period].rate

            });


        }



        return ranking.sort(

            (a,b)=>

            b.score-a.score

        );


    }





}



export default Backtest;