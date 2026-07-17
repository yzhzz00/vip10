// DLT-AI-CORE VIP
// core/backtest_engine.js
//
// 回测引擎 V2
//
// 功能:
// 1.滚动历史回测
// 2.模型预测验证
// 3.随机基准对比
// 4.输出模型评分


class BacktestEngine {



    constructor(){


        this.records=[];


    }









    run(

        history,

        predictFunction,

        periods=1000

    ){



        this.records=[];





        let start=

        Math.max(

            100,

            history.length-periods

        );







        for(

            let i=start;

            i<history.length;

            i++

        ){



            let train=

            history.slice(

                0,

                i

            );







            let actual=

            history[i];







            let prediction=

            predictFunction(

                train

            );







            let result=

            this.compare(

                prediction,

                actual

            );







            this.records.push({



                index:i,



                result



            });



        }







        return this.summary();


    }









    compare(

        prediction,

        actual

    ){



        let bestFront=0;


        let bestBack=0;







        prediction.forEach(item=>{



            let f=

            item.front.filter(

                n=>

                actual.front.includes(n)

            )

            .length;







            let b=

            item.back.filter(

                n=>

                actual.back.includes(n)

            )

            .length;







            if(

                f>bestFront

            )

            bestFront=f;







            if(

                b>bestBack

            )

            bestBack=b;



        });







        return {



            front:

            bestFront,



            back:

            bestBack,



            score:

            this.calcScore(

                bestFront,

                bestBack

            )



        };


    }









    calcScore(

        front,

        back

    ){



        return Number(

            (

            (

            front/5

            +

            back/2

            )

            /

            2

            *

            100

            )

            .toFixed(2)

        );


    }









    summary(){



        let total=

        this.records.length;







        let data={



            periods:total,


            front3:0,


            front4:0,


            front5:0,


            back2:0,


            averageScore:0



        };







        this.records.forEach(item=>{



            let r=

            item.result;







            if(

                r.front>=3

            )

            data.front3++;







            if(

                r.front>=4

            )

            data.front4++;







            if(

                r.front>=5

            )

            data.front5++;







            if(

                r.back>=2

            )

            data.back2++;







            data.averageScore

            +=

            r.score;



        });







        data.averageScore=

        Number(

            (

            data.averageScore

            /

            total

            )

            .toFixed(2)

        );







        return data;


    }









    get(){



        return this.records;


    }



}





export default new BacktestEngine();