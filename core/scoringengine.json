// 大乐透AI_V90
// Scoring Engine
// 综合评分引擎


window.ScoringEngine = {


    weights:{},


    initialized:false,





    init(weights={}){


        this.weights = {


            frequency:
            weights.frequency || 0.15,


            theory:
            weights.theory || 0.20,


            markov:
            weights.markov || 0.20,


            bayes:
            weights.bayes || 0.15,


            montecarlo:
            weights.montecarlo || 0.20,


            structure:
            weights.structure || 0.10



        };



        this.initialized=true;



        console.log(
            "ScoringEngine初始化完成"
        );


    },









    // 综合评分


    score(
        candidate,
        data={}
    ){



        let total=0;



        total +=

        this.frequencyScore(
            candidate,
            data.frequency
        )
        *
        this.weights.frequency;





        total +=

        this.theoryScore(
            candidate,
            data.theory
        )
        *
        this.weights.theory;





        total +=

        this.markovScore(
            candidate,
            data.markov
        )
        *
        this.weights.markov;






        total +=

        this.bayesScore(
            candidate,
            data.bayes
        )
        *
        this.weights.bayes;






        total +=

        this.montecarloScore(
            candidate,
            data.montecarlo
        )
        *
        this.weights.montecarlo;





        return Number(
            total.toFixed(4)
        );



    },









    // 频率评分


    frequencyScore(
        candidate,
        frequency
    ){


        if(!frequency){

            return 0;

        }


        let score=0;



        candidate.front.forEach(
            n=>{


                score +=

                frequency[n]
                ||
                0;


            }
        );



        return score;


    },









    // 理论评分


    theoryScore(
        candidate,
        theory
    ){


        if(!theory){

            return 50;

        }



        return theory.structure || 50;



    },









    // 马尔可夫评分


    markovScore(
        candidate,
        markov
    ){



        if(!markov){

            return 0;

        }



        return 50;


    },









    // 贝叶斯评分


    bayesScore(
        candidate,
        bayes
    ){


        if(!bayes){

            return 0;

        }



        let score=0;



        candidate.front.forEach(
            n=>{


                score +=

                bayes[n]
                ||
                0;


            }
        );



        return score;



    },









    // 蒙特卡罗评分


    montecarloScore(
        candidate,
        monte
    ){



        if(!monte){

            return 0;

        }



        return 50;


    },









    // 批量排序


    rank(
        candidates,
        data
    ){



        return candidates

        .map(
            item=>{


                return {


                    ...item,


                    score:

                    this.score(
                        item,
                        data
                    )


                };


            }
        )

        .sort(
            (
                a,b
            )=>

            b.score-a.score

        );



    }





};