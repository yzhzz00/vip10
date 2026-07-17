// DLT-AI-CORE VIP
// core/cycle.js
//
// 周期结构模型
//
// 作用:
// 分析号码活跃周期
// 判断号码是否处于周期窗口
//
// 特征:
// 1. 平均出现周期
// 2. 当前周期位置
// 3. 活跃度
// 4. 周期匹配评分


class CycleModel {


    constructor(){


        this.front={};

        this.back={};

        this.historyLength=0;


    }









    // ======================
    // 模型训练
    // ======================

    train(history){



        this.historyLength=

        history.length;



        this.front={};

        this.back={};







        for(let i=1;i<=35;i++){


            this.front[i]={

                cycle:0,

                position:0,

                activity:0,

                score:0

            };


        }







        for(let i=1;i<=12;i++){


            this.back[i]={

                cycle:0,

                position:0,

                activity:0,

                score:0

            };


        }






        this.calculate(

            history

        );





        return {


            front:this.front,


            back:this.back



        };


    }









    // ======================
    // 周期计算
    // ======================

    calculate(history){



        this.calculateType(

            history,

            this.front,

            "front",

            35

        );





        this.calculateType(

            history,

            this.back,

            "back",

            12

        );



    }









    calculateType(

        history,

        target,

        type,

        maxNum

    ){



        for(

            let num=1;

            num<=maxNum;

            num++

        ){



            let positions=[];







            history.forEach(

                (item,index)=>{


                    if(

                        item[type]

                        .includes(num)

                    ){


                        positions.push(index);


                    }



                }

            );







            if(

                positions.length<2

            ){



                target[num]={


                    cycle:0,


                    position:0,


                    activity:0,


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







            let avgCycle=

            gaps.reduce(

                (a,b)=>a+b,

                0

            )

            /

            gaps.length;







            let last=

            positions[

                positions.length-1

            ];







            let current=

            history.length

            -

            1

            -

            last;







            let activity=

            1

            -

            Math.abs(

                current-avgCycle

            )

            /

            (

                avgCycle+1

            );







            if(activity<0)

                activity=0;







            target[num]={


                cycle:

                Number(

                    avgCycle.toFixed(2)

                ),



                position:

                current,



                activity:

                Number(

                    activity.toFixed(3)

                ),



                score:

                Number(

                    (

                    activity*100

                    )

                    .toFixed(2)

                )



            };



        }


    }









    // ======================
    // 获取评分
    // ======================

    getFrontScore(num){


        return this.front[num]

        ?

        this.front[num].score

        :

        0;


    }








    getBackScore(num){


        return this.back[num]

        ?

        this.back[num].score

        :

        0;


    }









    // ======================
    // 组合评分
    // ======================

    evaluate(front,back){



        let score=0;





        front.forEach(num=>{


            score +=

            this.getFrontScore(num);



        });







        back.forEach(num=>{


            score +=

            this.getBackScore(num);



        });






        return Number(

            score.toFixed(2)

        );


    }



}



export default new CycleModel();