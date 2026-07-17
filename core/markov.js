// DLT-AI-CORE VIP
// core/markov.js
//
// 一阶马尔可夫转移模型
//
// 作用:
// 分析上一期开奖状态
// 对下一期号码进行转移概率评分
//
// 核心:
// P(下一期号码 | 上一期号码)


class MarkovModel {


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


            this.front[i]={};



            for(let j=1;j<=35;j++){


                this.front[i][j]=0;


            }


        }








        for(let i=1;i<=12;i++){


            this.back[i]={};



            for(let j=1;j<=12;j++){


                this.back[i][j]=0;


            }


        }








        this.calculate(history);



        return {


            front:this.front,


            back:this.back



        };


    }









    // ======================
    // 转移统计
    // ======================

    calculate(history){



        for(

            let i=1;

            i<history.length;

            i++

        ){



            const previous=

            history[i-1];



            const current=

            history[i];







            previous.front.forEach(oldNum=>{



                current.front.forEach(newNum=>{



                    this.front[oldNum][newNum]++;



                });



            });







            previous.back.forEach(oldNum=>{



                current.back.forEach(newNum=>{



                    this.back[oldNum][newNum]++;



                });



            });



        }






        this.normalize();


    }









    // ======================
    // 概率归一化
    // ======================

    normalize(){



        Object.keys(

            this.front

        )

        .forEach(oldNum=>{



            let total=

            Object.values(

                this.front[oldNum]

            )

            .reduce(

                (a,b)=>a+b,

                0

            );





            if(total>0){



                Object.keys(

                    this.front[oldNum]

                )

                .forEach(newNum=>{


                    this.front[oldNum][newNum]=

                    Number(

                        (

                        this.front[oldNum][newNum]

                        /

                        total

                        )

                        .toFixed(5)

                    );


                });



            }



        });









        Object.keys(

            this.back

        )

        .forEach(oldNum=>{



            let total=

            Object.values(

                this.back[oldNum]

            )

            .reduce(

                (a,b)=>a+b,

                0

            );





            if(total>0){



                Object.keys(

                    this.back[oldNum]

                )

                .forEach(newNum=>{


                    this.back[oldNum][newNum]=

                    Number(

                        (

                        this.back[oldNum][newNum]

                        /

                        total

                        )

                        .toFixed(5)

                    );


                });



            }



        });



    }









    // ======================
    // 预测评分
    // ======================

    evaluate(front,back,history){



        if(

            history.length===0

        )

            return 0;





        const last=

        history[

            history.length-1

        ];






        let score=0;








        front.forEach(num=>{



            last.front.forEach(lastNum=>{



                score +=

                (

                this.front[lastNum][num]

                ||

                0

                )

                *

                100;



            });



        });









        back.forEach(num=>{



            last.back.forEach(lastNum=>{



                score +=

                (

                this.back[lastNum][num]

                ||

                0

                )

                *

                100;



            });



        });






        return Number(

            score.toFixed(2)

        );


    }









    // ======================
    // 状态
    // ======================

    status(){



        return {


            history:

            this.historyLength,


            type:

            "first_order_markov"



        };


    }



}



export default new MarkovModel();