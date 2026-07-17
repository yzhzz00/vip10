// DLT-AI-CORE VIP
// core/trend.js
//
// 趋势分析模型
//
// 作用:
// 分析近期号码变化趋势
//
// 特点:
// 1. 最近100期重点观察
// 2. 最近300期辅助判断
// 3. 时间衰减权重
// 4. 输出趋势评分


class TrendModel {


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


                recent100:0,


                recent300:0,


                trend:0,


                score:0


            };


        }





        for(let i=1;i<=12;i++){


            this.back[i]={


                recent100:0,


                recent300:0,


                trend:0,


                score:0


            };


        }







        this.calculate(history);



        return {


            front:this.front,


            back:this.back


        };


    }









    // ======================
    // 趋势计算
    // ======================

    calculate(history){



        const length=

        history.length;





        history.forEach(

            (item,index)=>{



                const age=

                length-index;



                let weight=1;





                // 最近100期最高权重

                if(age<=100){


                    weight=1.5;


                }

                // 100-300期

                else if(age<=300){


                    weight=1.2;


                }

                // 更早历史

                else{


                    weight=0.8;


                }







                item.front.forEach(num=>{


                    if(this.front[num]){


                        if(age<=100)

                            this.front[num].recent100+=weight;



                        if(age<=300)

                            this.front[num].recent300+=weight;


                    }


                });








                item.back.forEach(num=>{


                    if(this.back[num]){


                        if(age<=100)

                            this.back[num].recent100+=weight;



                        if(age<=300)

                            this.back[num].recent300+=weight;


                    }


                });




            }

        );







        this.normalize();


    }









    // ======================
    // 评分归一化
    // ======================

    normalize(){



        let frontMax=0;


        let backMax=0;






        Object.values(

            this.front

        )

        .forEach(item=>{


            if(item.recent100>frontMax)

                frontMax=item.recent100;


        });






        Object.values(

            this.back

        )

        .forEach(item=>{


            if(item.recent100>backMax)

                backMax=item.recent100;


        });








        Object.keys(

            this.front

        )

        .forEach(num=>{


            let item=

            this.front[num];



            item.trend=

            item.recent100*0.7

            +

            item.recent300*0.3;



            item.score=

            Number(

                (

                item.trend

                /

                frontMax

                *

                100

                )

                .toFixed(2)

            );



        });








        Object.keys(

            this.back

        )

        .forEach(num=>{


            let item=

            this.back[num];



            item.trend=

            item.recent100*0.7

            +

            item.recent300*0.3;



            item.score=

            Number(

                (

                item.trend

                /

                backMax

                *

                100

                )

                .toFixed(2)

            );



        });



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


            score+=

            this.getFrontScore(num);



        });





        back.forEach(num=>{


            score+=

            this.getBackScore(num);



        });





        return Number(

            score.toFixed(2)

        );


    }







}



export default new TrendModel();