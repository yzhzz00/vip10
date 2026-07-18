/**
 * DLT-AI-CORE VIP
 * Bayesian Model V2.0
 *
 * 贝叶斯概率模型
 */



class BayesianModel {



    constructor(){


        this.name =
        "bayesian";


    }








    train(

        history=[],

        features={}

    ){



        const result=[];



        const totalDraws =

        history.length || 1;





        for(

            let num=1;

            num<=35;

            num++

        ){



            let count=0;


            let recentCount=0;





            history.forEach(

                item=>{



                    if(

                        item.front

                        .includes(num)

                    ){


                        count++;


                    }



                }

            );







            history

            .slice(-100)

            .forEach(

                item=>{


                    if(

                        item.front

                        .includes(num)

                    ){


                        recentCount++;


                    }



                }

            );








            /*
             * 贝叶斯平滑
             *
             * P(num)
             */


            const prior =

            (

                count + 1

            )

            /

            (

                totalDraws + 35

            );








            /*
             * 近期证据更新
             */


            const likelihood =


            (

                recentCount + 1

            )

            /

            101;









            const posterior =



            prior

            *

            likelihood;








            result.push({



                number:num,



                score:

                Number(

                    posterior

                    .toFixed(8)

                )



            });





        }







        return {



            name:this.name,



            numbers:

            result.sort(

                (a,b)=>

                b.score-a.score

            )



        };



    }






}



export default BayesianModel;