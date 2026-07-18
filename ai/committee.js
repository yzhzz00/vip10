// ai/committee.js


export class AICommittee {


    constructor(
        models
    ){


        this.models =
        models;


        this.name =
        "ai_committee";


    }





    // =====================
    // 单候选评分
    // =====================

    evaluate(
        candidate,
        weights={}
    ){


        let total=0;


        let detail=[];




        this.models.forEach(
        model=>{


            let result =

            model.predict(
                candidate
            );



            let weight =

            weights[
                model.name
            ]
            ||
            1;



            let value =

            result.score
            *
            weight;



            total += value;



            detail.push({


                model:
                model.name,


                score:
                result.score,


                weight,


                value



            });



        });





        return {


            candidate,


            score:
            total,


            detail



        };


    }





    // =====================
    // 批量竞争
    // =====================

    predict(
        candidates,
        weights={}
    ){



        let results =

        candidates.map(
        candidate=>{


            return this.evaluate(
                candidate,
                weights
            );


        });



        return results

        .sort(
        (a,b)=>

            b.score
            -
            a.score

        )

        .slice(
            0,
            3
        );


    }



}