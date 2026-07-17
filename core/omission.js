// DLT-AI-CORE VIP
// core/omission.js
// 遗漏周期模型
//
// 作用:
// 分析号码距离上次出现的期数
// 结合历史遗漏规律提供评分
//
// 注意:
// 遗漏不是预测规律，只作为一个辅助特征


class OmissionModel {


    constructor(){

        this.front = {};

        this.back = {};

        this.maxHistory = 0;

    }



    // ======================
    // 训练模型
    // ======================

    train(history){


        this.front={};

        this.back={};

        this.maxHistory=history.length;



        for(let i=1;i<=35;i++){

            this.front[i]={

                current:0,

                average:0,

                max:0,

                score:0,

                count:0

            };

        }




        for(let i=1;i<=12;i++){

            this.back[i]={

                current:0,

                average:0,

                max:0,

                score:0,

                count:0

            };

        }






        this.calculateFront(history);

        this.calculateBack(history);



        return {

            front:this.front,

            back:this.back

        };


    }









    // ======================
    // 前区遗漏计算
    // ======================

    calculateFront(history){



        for(let num=1;num<=35;num++){


            let gaps=[];

            let last=-1;



            history.forEach((item,index)=>{


                if(item.front.includes(num)){


                    if(last!==-1){

                        gaps.push(

                            index-last

                        );

                    }


                    last=index;


                }


            });





            const current=

            last===-1

            ?

            history.length

            :

            history.length-1-last;



            this.front[num].current=current;


            this.front[num].count=gaps.length;



            this.front[num].average=

            gaps.length

            ?

            this.average(gaps)

            :

            0;



            this.front[num].max=

            gaps.length

            ?

            Math.max(...gaps)

            :

            0;



            this.front[num].score=

            this.calculateScore(

                current,

                this.front[num].average,

                this.front[num].max

            );



        }


    }









    // ======================
    // 后区遗漏计算
    // ======================

    calculateBack(history){



        for(let num=1;num<=12;num++){


            let gaps=[];

            let last=-1;



            history.forEach((item,index)=>{


                if(item.back.includes(num)){


                    if(last!==-1){

                        gaps.push(

                            index-last

                        );

                    }


                    last=index;


                }


            });





            const current=

            last===-1

            ?

            history.length

            :

            history.length-1-last;



            this.back[num].current=current;


            this.back[num].count=gaps.length;



            this.back[num].average=

            gaps.length

            ?

            this.average(gaps)

            :

            0;



            this.back[num].max=

            gaps.length

            ?

            Math.max(...gaps)

            :

            0;



            this.back[num].score=

            this.calculateScore(

                current,

                this.back[num].average,

                this.back[num].max

            );



        }


    }









    // ======================
    // 遗漏评分
    // ======================

    calculateScore(

        current,

        average,

        max

    ){



        if(average===0)

            return 50;



        let score =

        50 +

        (

            current-average

        )

        /

        average

        *

        30;



        // 限制范围

        if(score<0)

            score=0;



        if(score>100)

            score=100;



        return Number(

            score.toFixed(2)

        );


    }









    average(arr){


        return arr.reduce(

            (a,b)=>a+b,

            0

        )

        /

        arr.length;


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



export default new OmissionModel();