// DLT-AI-CORE VIP
// models/bayes_model.js
//
// 贝叶斯概率模型
//
// 核心:
// 先验概率 + 新数据
// 更新后验概率


class BayesModel {


    constructor(){


        this.name = "bayes";


        this.frontProbability = {};

        this.backProbability = {};


    }







    // ======================
    // 训练
    // ======================

    train(history){



        let frontCount={};

        let backCount={};






        history.forEach(item=>{



            item.front.forEach(num=>{


                frontCount[num]=

                (

                    frontCount[num]

                    ||

                    0

                )

                +1;


            });







            item.back.forEach(num=>{


                backCount[num]=

                (

                    backCount[num]

                    ||

                    0

                )

                +1;


            });



        });








        const total =

        history.length;







        // 贝叶斯平滑

        for(

            let i=1;

            i<=35;

            i++

        ){



            let prior =

            1/35;



            let likelihood =

            (

                frontCount[i]

                ||

                0

            )

            /

            (

                total*5

            );








            this.frontProbability[i]=


            this.update(

                prior,

                likelihood

            );


        }








        for(

            let i=1;

            i<=12;

            i++

        ){



            let prior =

            1/12;



            let likelihood =

            (

                backCount[i]

                ||

                0

            )

            /

            (

                total*2

            );








            this.backProbability[i]=


            this.update(

                prior,

                likelihood

            );



        }






        return this;


    }









    // ======================
    // 贝叶斯更新
    // ======================

    update(

        prior,

        likelihood

    ){



        let value =

        prior *

        likelihood;






        return Number(

            value.toFixed(8)

        );



    }









    // ======================
    // 归一化
    // ======================

    normalize(obj){



        let sum =

        Object.values(obj)

        .reduce(

            (a,b)=>a+b,

            0

        );







        Object.keys(obj)

        .forEach(key=>{



            obj[key]=

            Number(

                (

                obj[key]

                /

                sum

                )

                .toFixed(6)

            );



        });



    }









    // ======================
    // 分析输出
    // ======================

    analyze(){



        this.normalize(

            this.frontProbability

        );



        this.normalize(

            this.backProbability

        );







        return {



            model:

            this.name,



            front:

            this.frontProbability,



            back:

            this.backProbability



        };


    }



}





export default new BayesModel();