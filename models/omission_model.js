// DLT-AI-CORE VIP
// models/omission_model.js
//
// 遗漏模型
//
// 分析号码遗漏周期


class OmissionModel {


    constructor(){


        this.front=[];


        this.back=[];


    }







    train(history){



        this.front=

        this.calculate(

            history,

            35,

            "front"

        );



        this.back=

        this.calculate(

            history,

            12,

            "back"

        );





        return true;


    }









    calculate(

        history,

        maxNum,

        type

    ){



        let result=[];







        for(

            let num=1;

            num<=maxNum;

            num++

        ){



            let currentGap=0;



            let gaps=[];





            for(

                let i=0;

                i<history.length;

                i++

            ){



                let hit=

                history[i][type]

                .includes(num);







                if(hit){



                    gaps.push(

                        currentGap

                    );



                    currentGap=0;



                }

                else{



                    currentGap++;



                }



            }







            let average=

            gaps.length

            ?

            gaps.reduce(

                (a,b)=>

                a+b,

                0

            )

            /

            gaps.length

            :

            1;







            // 当前遗漏越接近平均周期

            // 得分越高

            let deviation=

            Math.abs(

                currentGap-average

            );







            let score=

            100

            /

            (

                1+

                deviation

            );







            result.push({



                number:num,



                omission:

                currentGap,



                average:

                Number(

                    average.toFixed(2)

                ),



                score:

                Number(

                    score.toFixed(2)

                )



            });



        }







        return result.sort(

            (a,b)=>

            b.score-a.score

        );


    }









    analyze(){



        return {



            front:this.front,



            back:this.back



        };


    }



}





export default new OmissionModel();