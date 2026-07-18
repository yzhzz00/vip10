/**
 * DLT-AI-CORE VIP
 * Bayesian Model V5.0 FINAL
 *
 * 贝叶斯概率更新模型
 */


class BayesianModel {



    constructor(){


        this.name=

        "bayesian";


    }









    train(

        history=[],

        features={}

    ){



        const frequency =

        features.frequency || [];





        const missing =

        features.missing || [];







        const total =

        history.length*5;







        const result=[];







        for(

            let n=1;

            n<=35;

            n++

        ){





            const freq =

            frequency.find(

                x=>

                x.number===n

            );





            const miss =

            missing.find(

                x=>

                x.number===n

            );









            const count =

            freq

            ?

            freq.count

            :

            0;







            /*
             * 先验概率
             */


            const prior =

            count /

            total;








            /*
             * 遗漏修正
             */


            const likelihood =

            1 +

            (

                miss

                ?

                miss.missing/100

                :

                0

            );








            const posterior =

            prior *

            likelihood;







            result.push({



                number:n,



                probability:

                Number(

                    posterior.toFixed(6)

                ),



                score:

                Number(

                    (

                    posterior*10000

                    )

                    .toFixed(3)

                )



            });



        }







        result.sort(

            (a,b)=>

            b.score-a.score

        );







        return {



            name:

            this.name,



            numbers:

            result,



            top:

            result.slice(

                0,

                10

            )



        };



    }





}



export default BayesianModel;