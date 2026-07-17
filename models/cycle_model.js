// DLT-AI-CORE VIP
// models/cycle_model.js
//
// 周期模型
//
// 分析:
// 出现周期
// 平均间隔
// 当前周期位置


class CycleModel {


    constructor(){


        this.name = "cycle";


        this.frontCycle = {};

        this.backCycle = {};



    }







    // ======================
    // 训练
    // ======================

    train(history){



        this.frontCycle =

        this.calculateCycle(

            history,

            "front",

            35

        );





        this.backCycle =

        this.calculateCycle(

            history,

            "back",

            12

        );







        return this;


    }









    // ======================
    // 周期计算
    // ======================

    calculateCycle(

        history,

        type,

        max

    ){



        let result={};







        for(

            let num=1;

            num<=max;

            num++

        ){



            let positions=[];







            history.forEach(

            (item,index)=>{



                if(

                    item[type]

                    .includes(num)

                ){



                    positions.push(

                        index

                    );


                }



            });



            if(

                positions.length<2

            ){



                result[num]={


                    average:0,


                    current:0,


                    score:0


                };



                continue;


            }







            let gaps=[];







            for(

                let i=1;

                i<positions.length;

                i++

            ){



                gaps.push(

                    positions[i]

                    -

                    positions[i-1]

                );


            }







            let average =

            gaps.reduce(

                (a,b)=>a+b,

                0

            )

            /

            gaps.length;







            let current =

            history.length

            -

            positions[

                positions.length-1

            ];







            result[num]={



                average:

                Number(

                    average.toFixed(2)

                ),



                current,



                score:

                this.cycleScore(

                    current,

                    average

                )



            };



        }






        return result;


    }









    // ======================
    // 周期评分
    // ======================

    cycleScore(

        current,

        average

    ){



        if(

            average===0

        )

            return 0;






        let distance =

        Math.abs(

            current-average

        );






        return Number(

            (

            1

            -

            distance

            /

            (

            average+1

            )

            )

            .toFixed(4)

        );



    }









    // ======================
    // 输出
    // ======================

    analyze(){



        return {



            model:

            this.name,



            front:

            this.frontCycle,



            back:

            this.backCycle



        };



    }



}





export default new CycleModel();