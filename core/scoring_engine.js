/**
 * DLT-AI-CORE VIP
 * 综合评分引擎
 */


class ScoringEngine {


    constructor(){


        this.weights = {


            statistics:0.20,


            bayesian:0.20,


            markov:0.15,


            matrix:0.15,


            structure:0.15,


            ensemble:0.15


        };


    }





    /**
     * 设置权重
     */
    setWeights(
        weights={}
    ){


        this.weights = {


            ...this.weights,


            ...weights


        };


    }






    /**
     * 单号码综合评分
     */
    scoreNumber(
        modelScores={}
    ){


        let total = 0;



        Object.keys(
            this.weights
        )
        .forEach(
            key=>{


                const value =
                modelScores[key]
                ||
                0;



                total +=
                value *
                this.weights[key];


            }
        );



        return Number(
            total.toFixed(6)
        );


    }





    /**
     * 批量评分
     */
    rankNumbers(
        numbers=[]
    ){


        return numbers

        .map(
            item=>({


                number:
                item.number,


                score:
                this.scoreNumber(
                    item.models
                )


            })
        )


        .sort(
            (a,b)=>
            b.score-a.score
        );


    }





    /**
     * 自动调整权重
     *
     * 根据回测结果
     */
    updateWeight(
        accuracy={}
    ){


        const total =
        Object.values(
            accuracy
        )
        .reduce(
            (a,b)=>a+b,
            0
        );



        if(
            total===0
        ){

            return this.weights;

        }



        Object.keys(
            accuracy
        )
        .forEach(
            key=>{


                if(
                    this.weights[key]
                    !==undefined
                ){


                    this.weights[key]
                    =
                    Number(
                        (
                        accuracy[key]
                        /
                        total
                        )
                        .toFixed(4)
                    );


                }


            }
        );



        return this.weights;


    }





    getWeights(){

        return this.weights;

    }


}



export default ScoringEngine;