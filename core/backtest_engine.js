// DLT-AI-CORE VIP
// core/backtest_engine.js
//
// 回测引擎
//
// 功能:
// 历史逐期验证模型表现


class BacktestEngine {



    constructor(){


        this.records=[];


    }









    // ======================
    // 执行回测
    // ======================

    run(

        history,

        predictFunction

    ){



        this.records=[];







        for(

            let i=100;

            i<history.length;

            i++

        ){



            let trainData=

            history.slice(

                i

            );







            let real=

            history[i];







            let prediction=

            predictFunction(

                trainData

            );







            let result=

            this.compare(

                prediction,

                real

            );







            this.records.push({



                period:i,



                prediction,



                real,



                result



            });



        }







        return this.summary();


    }









    // ======================
    // 比较结果
    // ======================

    compare(

        prediction,

        real

    ){



        let frontHit=0;


        let backHit=0;







        prediction.forEach(item=>{



            item.front.forEach(num=>{



                if(

                    real.front.includes(num)

                ){



                    frontHit++;



                }



            });







            item.back.forEach(num=>{



                if(

                    real.back.includes(num)

                ){



                    backHit++;



                }



            });



        });







        return {



            frontHit,


            backHit



        };



    }









    // ======================
    // 汇总
    // ======================

    summary(){



        let total=

        this.records.length;







        let front=0;


        let back=0;







        this.records.forEach(item=>{



            front +=

            item.result.frontHit;



            back +=

            item.result.backHit;



        });







        return {



            periods:total,



            averageFront:

            Number(

                (

                front/total

                )

                .toFixed(4)

            ),



            averageBack:

            Number(

                (

                back/total

                )

                .toFixed(4)

            ),



            records:

            this.records



        };



    }









    get(){



        return this.records;


    }



}





export default new BacktestEngine();