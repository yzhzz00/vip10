/**
 * DLT-AI-CORE VIP
 * 集成学习模型
 */


class EnsembleModel {


    constructor(){


        this.weights={

            statistics:0.20,

            bayesian:0.20,

            markov:0.15,

            matrix:0.15,

            structure:0.15,

            ensemble:0.15

        };


        this.result={};


    }





    /**
     * 训练融合模型
     */
    train(
        models={}
    ){


        this.result =
        models;



        return {


            name:
            "ensemble",



            numbers:
            this.rankNumbers()


        };


    }





    /**
     * 综合评分
     */
    score(
        number
    ){


        let total=0;



        Object.keys(
            this.result
        )
        .forEach(
            model=>{


                const data =
                this.result[model];



                if(
                    !data
                    ||
                    !data.numbers
                ){

                    return;

                }



                const item =
                data.numbers.find(

                    x=>
                    x.number===number

                );



                if(item){


                    total +=

                    item.score *

                    (
                    this.weights[model]
                    ||
                    0
                    );


                }



            }

        );



        return Number(

            total.toFixed(6)

        );


    }





    /**
     * 最终排名
     */
    rankNumbers(){


        const result=[];



        for(
            let i=1;
            i<=35;
            i++
        ){


            result.push({

                number:i,


                score:
                this.score(i)

            });


        }



        return result.sort(

            (a,b)=>
            b.score-a.score

        );


    }





    /**
     * 模型竞争
     */
    compete(){


        const ranking=[];



        Object.keys(
            this.result
        )
        .forEach(
            name=>{


                ranking.push({

                    model:name,


                    top:
                    this.result[name]
                    ?.numbers
                    ?.slice(0,5)
                    ||
                    []

                });


            }

        );



        return ranking;


    }





    /**
     * 调整权重
     */
    updateWeights(
        weights={}
    ){


        this.weights={

            ...this.weights,

            ...weights

        };


    }





    status(){


        return {


            type:
            "ensemble",


            models:
            Object.keys(
                this.result
            )


        };


    }



}



export default EnsembleModel;