// DLT-AI-CORE VIP
// models/omission_model.js
//
// 遗漏模型
//
// 分析:
// 当前遗漏
// 平均遗漏
// 最大遗漏
// 回补周期


class OmissionModel {


    constructor(){


        this.name = "omission";


        this.frontOmission = {};

        this.backOmission = {};

        this.frontHistory = {};

        this.backHistory = {};



    }







    // ======================
    // 训练
    // ======================

    train(history){



        for(

            let i=1;

            i<=35;

            i++

        ){



            this.frontHistory[i]=[];


        }






        for(

            let i=1;

            i<=12;

            i++

        ){



            this.backHistory[i]=[];


        }







        history.forEach(item=>{



            item.front.forEach(num=>{


                this.frontHistory[num]

                .push(1);



            });







            item.back.forEach(num=>{


                this.backHistory[num]

                .push(1);



            });



        });







        this.calculate(

            history

        );





        return this;


    }









    // ======================
    // 计算遗漏
    // ======================

    calculate(history){



        for(

            let num=1;

            num<=35;

            num++

        ){



            let miss=0;



            for(

                let i=history.length-1;

                i>=0;

                i--

            ){



                if(

                    history[i]

                    .front

                    .includes(num)

                )

                    break;



                miss++;



            }






            this.frontOmission[num]=miss;



        }








        for(

            let num=1;

            num<=12;

            num++

        ){



            let miss=0;



            for(

                let i=history.length-1;

                i>=0;

                i--

            ){



                if(

                    history[i]

                    .back

                    .includes(num)

                )

                    break;



                miss++;



            }






            this.backOmission[num]=miss;



        }



    }









    // ======================
    // 遗漏评分
    // ======================

    score(

        omission,

        max

    ){



        if(max===0)

            return 0;







        return Number(



            (

            omission

            /

            max

            )

            .toFixed(4)



        );



    }









    // ======================
    // 输出分析
    // ======================

    analyze(){



        let maxFront =

        Math.max(

            ...

            Object.values(

                this.frontOmission

            )

        );



        let maxBack =

        Math.max(

            ...

            Object.values(

                this.backOmission

            )

        );







        let front=[];


        let back=[];







        for(

            let i=1;

            i<=35;

            i++

        ){



            front.push({



                number:i,



                omission:

                this.frontOmission[i],



                score:

                this.score(

                    this.frontOmission[i],

                    maxFront

                )



            });



        }








        for(

            let i=1;

            i<=12;

            i++

        ){



            back.push({



                number:i,



                omission:

                this.backOmission[i],



                score:

                this.score(

                    this.backOmission[i],

                    maxBack

                )



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





export default new OmissionModel();