// DLT-AI-CORE VIP
// models/bayes_model.js
//
// 贝叶斯模型
//
// 历史先验 + 新数据更新


class BayesModel {



    constructor(){


        this.front=[];


        this.back=[];


    }









    train(history){



        let frontCount={};


        let backCount={};







        for(let i=1;i<=35;i++){



            frontCount[i]=0;



        }







        for(let i=1;i<=12;i++){



            backCount[i]=0;



        }







        let totalFront=

        history.length*5;





        let totalBack=

        history.length*2;







        history.forEach(item=>{



            item.front.forEach(num=>{



                frontCount[num]++;



            });







            item.back.forEach(num=>{



                backCount[num]++;



            });



        });








        // 贝叶斯平滑

        let alpha=1;







        this.front=

        Object.keys(frontCount)

        .map(num=>{



            let prior=

            (

                frontCount[num]+alpha

            )

            /

            (

                totalFront+

                35*alpha

            );







            return {



                number:Number(num),



                score:

                Number(

                    (

                    prior*100

                    )

                    .toFixed(2)

                )



            };



        })

        .sort(

            (a,b)=>

            b.score-a.score

        );








        this.back=

        Object.keys(backCount)

        .map(num=>{



            let prior=

            (

                backCount[num]+alpha

            )

            /

            (

                totalBack+

                12*alpha

            );







            return {



                number:Number(num),



                score:

                Number(

                    (

                    prior*100

                    )

                    .toFixed(2)

                )



            };



        })

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





export default new BayesModel();