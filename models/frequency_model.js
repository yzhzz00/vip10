// DLT-AI-CORE VIP
// models/frequency_model.js
//
// 频率模型
//
// 分析:
// 号码历史出现次数
// 热度
// 活跃程度


class FrequencyModel {


    constructor(){


        this.name = "frequency";


    }







    // ======================
    // 训练
    // ======================

    train(history){



        this.frontCount = {};

        this.backCount = {};






        // 前区统计

        history.forEach(item=>{


            item.front.forEach(num=>{


                this.frontCount[num] =

                (

                    this.frontCount[num]

                    ||

                    0

                )

                +1;


            });







            item.back.forEach(num=>{


                this.backCount[num] =

                (

                    this.backCount[num]

                    ||

                    0

                )

                +1;


            });



        });






        return this;


    }









    // ======================
    // 前区评分
    // ======================

    scoreFront(num){



        let max =

        Math.max(

            ...

            Object.values(

                this.frontCount

            )

        );





        return Number(

            (

            this.frontCount[num]

            /

            max

            )

            .toFixed(4)

        );



    }









    // ======================
    // 后区评分
    // ======================

    scoreBack(num){



        let max =

        Math.max(

            ...

            Object.values(

                this.backCount

            )

        );






        return Number(

            (

            this.backCount[num]

            /

            max

            )

            .toFixed(4)

        );


    }









    // ======================
    // 生成评分表
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



            front,



            back



        };


    }







}





export default new FrequencyModel();