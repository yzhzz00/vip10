// DLT-AI-CORE VIP
// core/bayes.js
//
// 贝叶斯概率模型
//
// 作用:
// 根据历史先验 + 当前趋势证据
// 更新号码后验概率评分
//
// 核心:
// posterior ∝ prior × likelihood


class BayesModel {


    constructor(){


        this.front={};

        this.back={};

        this.historyLength=0;


    }









    // ======================
    // 训练模型
    // ======================

    train(history){



        this.historyLength=

        history.length;



        this.front={};

        this.back={};





        for(let i=1;i<=35;i++){


            this.front[i]={


                prior:0,


                recent:0,


                posterior:0,


                score:0



            };


        }





        for(let i=1;i<=12;i++){


            this.back[i]={


                prior:0,


                recent:0,


                posterior:0,


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
    // 贝叶斯计算
    // ======================

    calculate(history){



        const length=

        history.length;





        history.forEach(

            (item,index)=>{



                const age=

                length-index;





                let weight=1;



                // 最近数据作为证据

                if(age<=50){


                    weight=2;


                }

                else if(age<=200){


                    weight=1.5;


                }

                else{


                    weight=1;


                }








                item.front.forEach(num=>{


                    this.front[num].recent+=weight;


                });








                item.back.forEach(num=>{


                    this.back[num].recent+=weight;


                });



            }

        );






        // 计算先验

        Object.keys(

            this.front

        )

        .forEach(num=>{



            this.front[num].prior=

            this.countFront(

                history,

                Number(num)

            )

            /

            (

                history.length*5

            );



        });








        Object.keys(

            this.back

        )

        .forEach(num=>{



            this.back[num].prior=

            this.countBack(

                history,

                Number(num)

            )

            /

            (

                history.length*2

            );



        });








        this.updatePosterior();


    }









    // ======================
    // 后验概率更新
    // ======================

    updatePosterior(){



        let frontMax=0;

        let backMax=0;







        Object.values(

            this.front

        )

        .forEach(item=>{


            item.posterior=

            item.prior

            *

            (

                1+

                item.recent

                /

                1000

            );



            if(item.posterior>frontMax)

                frontMax=item.posterior;


        });








        Object.values(

            this.back

        )

        .forEach(item=>{


            item.posterior=

            item.prior

            *

            (

                1+

                item.recent

                /

               500

            );



            if(item.posterior>backMax)

                backMax=item.posterior;


        });








        Object.keys(

            this.front

        )

        .forEach(num=>{


            this.front[num].score=

            Number(

                (

                this.front[num].posterior

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


            this.back[num].score=

            Number(

                (

                this.back[num].posterior

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
    // 统计
    // ======================

    countFront(history,num){



        let count=0;



        history.forEach(item=>{


            if(

                item.front.includes(num)

            )

                count++;


        });



        return count;


    }







    countBack(history,num){



        let count=0;



        history.forEach(item=>{


            if(

                item.back.includes(num)

            )

                count++;


        });



        return count;


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



export default new BayesModel();