/**
 * DLT-AI-CORE VIP
 * Statistics Model V5.0 FINAL
 *
 * 历史统计评分模型
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



        const frequency =

        features.frequency || [];





        const missing =

        features.missing || [];







        const result=[];







        for(

            let n=1;

            n<=35;

            n++

        ){



            const freqItem =

            frequency.find(

                x=>

                x.number===n

            );






            const missItem =

            missing.find(

                x=>

                x.number===n

            );








            const freqScore =

            freqItem

            ?

            freqItem.count

            :

            0;







            const missScore =

            missItem

            ?

            missItem.missing*2

            :

            0;









            const score =

            freqScore +

            missScore;








            result.push({



                number:n,



                score:Number(

                    score.toFixed(3)

                )



            });



        }








        result.sort(

            (a,b)=>

            b.score-a.score

        );







        return {



            name:this.name,



            numbers:result,



            top:

            result.slice(

                0,

                10

            )



        };



    }





}



export default StatisticsModel;