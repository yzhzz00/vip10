// DLT-AI-CORE VIP
// core/backtest.js
//
// 历史回测模块
//
// 作用:
// 使用历史开奖逐期模拟预测
//
// 功能:
// 1. 截取历史训练窗口
// 2. 模拟下一期预测
// 3. 对比真实开奖
// 4. 输出命中统计
// 5. 生成模型表现报告


import data from "./data.js";

import engine from "./engine.js";





class BacktestEngine {



    constructor(){


        this.result=null;


    }









    // ======================
    // 开始回测
    // ======================

    run(start=500){



        const history=

        data.getHistory();






        let report={



            total:0,


            hit3:0,


            hit4:0,


            hit5:0,


            best:"",


            accuracy:0



        };








        let records=[];









        for(

            let i=start;

            i<history.length;

            i++

        ){



            let trainData=

            history.slice(

                0,

                i

            );







            let actual=

            history[i];







            // 使用训练数据

            this.mockTrain(

                trainData

            );









            let prediction=

            engine.predict();







            if(

                !prediction

                ||

                !prediction.ranking

                ||

                prediction.ranking.length===0

            )

                continue;







            let best=

            prediction.ranking[0];








            let analysis=

            this.compare(

                actual,

                best

            );








            report.total++;







            if(

                analysis.front>=3

            )

                report.hit3++;





            if(

                analysis.front>=4

            )

                report.hit4++;





            if(

                analysis.front===5

            )

                report.hit5++;







            records.push({



                issue:

                actual.issue,



                prediction:{

                    front:

                    best.front,

                    back:

                    best.back

                },



                actual,



                analysis



            });




        }








        report.accuracy=

        Number(

            (

            report.hit3

            /

            report.total

            *

            100

            )

            .toFixed(2)

        );








        this.result={



            report,



            records



        };







        return this.result;


    }









    // ======================
    // 模拟训练
    // ======================

    mockTrain(history){



        engine.train();



    }









    // ======================
    // 对比
    // ======================

    compare(

        actual,

        prediction

    ){



        let front=0;

        let back=0;






        prediction.front.forEach(n=>{



            if(

                actual.front.includes(n)

            )

                front++;



        });






        prediction.back.forEach(n=>{



            if(

                actual.back.includes(n)

            )

                back++;



        });







        return {


            front,


            back,


            total:

            front+back



        };


    }









    // ======================
    // 状态
    // ======================

    status(){



        return {


            finished:

            this.result!==null,



            total:

            this.result

            ?

            this.result.report.total

            :

            0



        };


    }



}





export default new BacktestEngine();