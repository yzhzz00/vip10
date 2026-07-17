// DLT-AI-CORE VIP
// models/trend_model.js
//
// 趋势模型
//
// 分析近期号码活跃趋势


class TrendModel {


    constructor(){


        this.front=[];


        this.back=[];


    }








    train(history){



        let frontScore={};


        let backScore={};







        for(let i=1;i<=35;i++){


            frontScore[i]=0;


        }






        for(let i=1;i<=12;i++){


            backScore[i]=0;


        }







        let length=history.length;







        history.forEach((item,index)=>{



            // 越近期权重越高

            let weight=

            (

                index+1

            )

            /

            length;







            item.front.forEach(num=>{



                frontScore[num]+=weight;



            });







            item.back.forEach(num=>{



                backScore[num]+=weight;



            });



        });







        let maxFront=

        Math.max(

            ...Object.values(frontScore)

        );







        let maxBack=

        Math.max(

            ...Object.values(backScore)

        );







        this.front=

        Object.keys(frontScore)

        .map(num=>({



            number:Number(num),



            score:Number(

                (

                frontScore[num]

                /

                maxFront

                *

                100

                )

                .toFixed(2)

            )



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );








        this.back=

        Object.keys(backScore)

        .map(num=>({



            number:Number(num),



            score:Number(

                (

                backScore[num]

                /

                maxBack

                *

                100

                )

                .toFixed(2)

            )



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );






        return true;


    }









    analyze(){



        return {


            front:this.front,


            back:this.back



        };


    }



}





export default new TrendModel();