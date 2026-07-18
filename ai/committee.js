// ai/committee.js


export class AICommittee {


    constructor(models=[]){


        this.models =
            models;


        this.results=[];


    }



    // =========================
    // 模型预测竞争
    // =========================

    compete(
        candidate,
        context={}
    ){


        this.results=[];



        this.models.forEach(
            model=>{


                let result =
                    model.predict(
                        candidate,
                        context
                    );



                this.results.push({

                    model:
                        model.name,


                    score:
                        result.score


                });


            }
        );



        return this.rank();


    }



    // =========================
    // 排名
    // =========================

    rank(){


        return this.results
        .sort(
            (a,b)=>
            b.score-a.score
        );


    }



    // =========================
    // 综合评分
    // =========================

    combine(
        candidate,
        weights={}
    ){


        let total=0;



        this.models.forEach(
            model=>{


                let result =
                    model.predict(
                        candidate
                    );



                let weight =
                    weights[model.name]
                    ||
                    1;



                total +=
                    result.score
                    *
                    weight;



            }
        );



        return {


            candidate,


            score:
                total


        };


    }



    // =========================
    // 最终预测
    // =========================

    predict(
        candidates,
        weights={}
    ){


        let ranking =
            candidates.map(
                c=>

                this.combine(
                    c,
                    weights
                )

            );



        return ranking
        .sort(
            (a,b)=>
            b.score-a.score
        )
        .slice(
            0,
            3
        );


    }



}