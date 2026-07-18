/**
 * DLT-AI-CORE VIP
 * Statistics Model V2.0
 *
 * 基础统计概率模型
 */



class StatisticsModel {



    constructor(){


        this.name =
        "statistics";


    }







    train(

        history=[],

        features={}

    ){



        const scores=[];



        for(

            let num=1;

            num<=35;

            num++

        ){



            let total=0;


            let recent=0;



            history.forEach(

                item=>{



                    if(

                        item.front

                        .includes(num)

                    ){


                        total++;


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


                        recent++;


                    }



                }

            );









            const score =



            total

            *

            0.7



            +

            recent

            *

            1.5;







            scores.push({



                number:num,



                score:Number(

                    score

                    .toFixed(3)

                )



            });



        }






        return {



            name:this.name,



            numbers:

            scores

            .sort(

                (a,b)=>

                b.score-a.score

            )



        };



    }






}



export default StatisticsModel;