/**
 * DLT-AI-CORE VIP
 * 贝叶斯概率模型
 */


class BayesianModel {


    constructor(){


        this.prior = {};

        this.posterior = {};

        this.total = 0;


    }





    /**
     * 模型训练
     */
    train(
        history=[],
        features={}
    ){


        this.total =
        history.length;



        const count={};



        for(
            let i=1;
            i<=35;
            i++
        ){

            count[i]=0;

        }



        history.forEach(
            item=>{


                item.front.forEach(
                    n=>{

                        count[n]++;

                    }
                );


            }
        );



        /*
         * 先验概率
         */

        for(
            let i=1;
            i<=35;
            i++
        ){


            this.prior[i]
            =
            1/35;


        }



        /*
         * 后验概率更新
         *
         * 拉普拉斯平滑
         */

        for(
            let i=1;
            i<=35;
            i++
        ){


            this.posterior[i]
            =

            (
                count[i]+1
            )

            /

            (
                this.total*5+35
            );


        }



        return {


            name:
            "bayesian",


            numbers:
            this.rankNumbers()


        };


    }





    /**
     * 单号码概率
     */
    score(
        number
    ){


        return Number(

            (
            this.posterior[number]
            ||
            0
            )

            .toFixed(8)

        );


    }





    /**
     * 排序
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
     * 获取后验概率
     */
    getPosterior(){

        return this.posterior;

    }




    status(){


        return {


            type:
            "bayesian",


            samples:
            this.total


        };


    }


}



export default BayesianModel;