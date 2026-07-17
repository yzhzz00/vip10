// DLT-AI-CORE VIP
// models/trend_model.js
//
// 趋势模型
//
// 分析:
// 最近走势
// 活跃变化
// 短期趋势


class TrendModel {


    constructor(){


        this.name = "trend";


        this.recent = 30;


        this.frontTrend = {};

        this.backTrend = {};


    }







    // ======================
    // 训练
    // ======================

    train(history){



        let data =

        history.slice(

            -this.recent

        );





        this.frontTrend = {};

        this.backTrend = {};







        data.forEach((item,index)=>{



            let weight =

            index + 1;







            item.front.forEach(num=>{



                this.frontTrend[num] =

                (

                    this.frontTrend[num]

                    ||

                    0

                )

                +

                weight;



            });








            item.back.forEach(num=>{



                this.backTrend[num] =

                (

                    this.backTrend[num]

                    ||

                    0

                )

                +

                weight;



            });






        });






        return this;


    }









    // ======================
    // 前区趋势评分
    // ======================

    scoreFront(num){



        let max =

        Math.max(

            ...

            Object.values(

                this.frontTrend

            )

        );





        if(!max)

            return 0;







        return Number(

            (

            this.frontTrend[num]

            /

            max

            )

            .toFixed(4)

        );


    }









    // ======================
    // 后区趋势评分
    // ======================

    scoreBack(num){



        let max =

        Math.max(

            ...

            Object.values(

                this.backTrend

            )

        );





        if(!max)

            return 0;







        return Number(

            (

            this.backTrend[num]

            /

            max

            )

            .toFixed(4)

        );


    }









    // ======================
    // 分析输出
    // ======================

    analyze(){



        let front=[];


        let back=[];






        for(

            let i=1;

            i<=35;

            i++

        ){


            front.push({


                number:i,


                score:

                this.scoreFront(i)


            });



        }






        for(

            let i=1;

            i<=12;

            i++

        ){



            back.push({


                number:i,


                score:

                this.scoreBack(i)


            });



        }






        return {


            model:

            this.name,



            window:

            this.recent,



            front,



            back



        };


    }




}





export default new TrendModel();