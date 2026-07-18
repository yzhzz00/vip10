/**
 * DLT-AI-CORE VIP
 * Markov Model V2.0
 *
 * 一阶马尔可夫转移模型
 */


class MarkovModel {



    constructor(){


        this.name =
        "markov";


    }







    train(

        history=[],

        features={}

    ){



        const transition={};



        /*
         * 初始化转移矩阵
         */

        for(

            let i=1;

            i<=35;

            i++

        ){


            transition[i]={};


        }








        /*
         * 构建:
         *
         * 上一期号码
         *
         * ->
         *
         * 下一期号码
         */


        for(

            let i=1;

            i<history.length;

            i++

        ){



            const prev =

            history[i-1]
            .front;



            const next =

            history[i]
            .front;





            prev.forEach(

                p=>{


                    if(
                        !transition[p]
                    ){

                        transition[p]={};

                    }




                    next.forEach(

                        n=>{


                            if(
                                !transition[p][n]
                            ){

                                transition[p][n]=0;

                            }


                            transition[p][n]++;



                        }

                    );



                }

            );



        }







        const scores=[];






        /*
         * 使用最近一期状态预测
         */


        const last =

        history.length

        ?

        history[
            history.length-1
        ]

        .front

        :

        [];







        for(

            let num=1;

            num<=35;

            num++

        ){



            let score=0;





            last.forEach(

                prev=>{


                    const map =

                    transition[prev];



                    if(
                        map
                        &&
                        map[num]
                    ){


                        score +=

                        map[num];


                    }



                }

            );







            scores.push({



                number:num,



                score:

                Number(

                    score

                    .toFixed(3)

                )



            });



        }








        /*
         * 没有转移记录保护
         */

        const hasValue =

        scores.some(

            x=>

            x.score>0

        );




        if(
            !hasValue
        ){


            scores.forEach(

                x=>{

                    x.score=1;

                }

            );


        }








        return {



            name:this.name,



            numbers:

            scores.sort(

                (a,b)=>

                b.score-a.score

            )



        };



    }






}



export default MarkovModel;