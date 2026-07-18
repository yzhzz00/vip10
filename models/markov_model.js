/**
 * DLT-AI-CORE VIP
 * 马尔可夫转移模型
 */


class MarkovModel {


    constructor(){


        this.transition = {};

        this.history=[];


    }





    /**
     * 训练模型
     */
    train(
        history=[],
        features={}
    ){


        this.history =
        history;



        this.transition={};



        for(
            let i=0;
            i<history.length-1;
            i++
        ){


            const current =
            history[i].front;



            const next =
            history[i+1].front;




            current.forEach(
                from=>{


                    if(
                        !this.transition[from]
                    ){

                        this.transition[from]={};

                    }



                    next.forEach(
                        to=>{


                            if(
                                !this.transition[from][to]
                            ){

                                this.transition[from][to]
                                =0;

                            }


                            this.transition[from][to]++;


                        }
                    );



                }
            );



        }



        return {


            name:
            "markov",



            numbers:
            this.rankNumbers()


        };


    }





    /**
     * 单号码转移评分
     */
    score(
        number
    ){


        if(
            !this.transition[number]
        ){

            return 0;

        }



        const map =
        this.transition[number];



        const total =
        Object.values(
            map
        )
        .reduce(
            (a,b)=>a+b,
            0
        );



        if(
            total===0
        ){

            return 0;

        }



        /*
         * 当前数字作为下一期出现概率
         */
        return Number(

            (
            (
            map[number]
            ||
            0
            )

            /

            total

            )

            .toFixed(6)

            )

        ;



    }





    /**
     * 转移概率排序
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
     * 获取转移矩阵
     */
    getMatrix(){

        return this.transition;

    }





    status(){


        return {


            type:
            "markov",


            states:
            Object.keys(
                this.transition
            ).length


        };


    }



}



export default MarkovModel;