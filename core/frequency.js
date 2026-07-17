// DLT-AI-CORE VIP
// core/frequency.js
//
// 历史频率分析模型
//
// 作用:
// 统计号码长期出现频率
// 生成基础概率评分
//
// 输入:
// 历史开奖数据
//
// 输出:
// 每个号码长期频率评分


class FrequencyModel {


    constructor(){


        this.front={};


        this.back={};


        this.total=0;


    }








    // ======================
    // 模型训练
    // ======================

    train(history){



        this.total=

        history.length;



        this.front={};

        this.back={};






        for(let i=1;i<=35;i++){


            this.front[i]={

                count:0,

                probability:0,

                score:0

            };


        }





        for(let i=1;i<=12;i++){


            this.back[i]={

                count:0,

                probability:0,

                score:0

            };


        }








        history.forEach(item=>{



            item.front.forEach(num=>{


                this.front[num].count++;


            });





            item.back.forEach(num=>{


                this.back[num].count++;


            });



        });







        this.calculateScore();



        return {


            front:this.front,


            back:this.back


        };


    }









    // ======================
    // 计算评分
    // ======================

    calculateScore(){



        let frontMax=0;


        let backMax=0;






        Object.values(

            this.front

        )

        .forEach(item=>{


            if(item.count>frontMax)

                frontMax=item.count;


        });







        Object.values(

            this.back

        )

        .forEach(item=>{


            if(item.count>backMax)

                backMax=item.count;


        });








        Object.keys(

            this.front

        )

        .forEach(num=>{



            const item=

            this.front[num];



            item.probability=

            item.count

            /

            (

                this.total*5

            );





            item.score=

            Number(

                (

                item.count

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



            const item=

            this.back[num];



            item.probability=

            item.count

            /

            (

                this.total*2

            );





            item.score=

            Number(

                (

                item.count

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
    // 获取前区评分
    // ======================

    getFrontScore(num){


        return this.front[num]

        ?

        this.front[num].score

        :

        0;


    }









    // ======================
    // 获取后区评分
    // ======================

    getBackScore(num){


        return this.back[num]

        ?

        this.back[num].score

        :

        0;


    }









    // ======================
    // 组合评价
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







    // ======================
    // 状态
    // ======================

    status(){



        return {


            history:

            this.total,



            frontNumbers:

            Object.keys(

                this.front

            ).length,



            backNumbers:

            Object.keys(

                this.back

            ).length



        };


    }



}



export default new FrequencyModel();