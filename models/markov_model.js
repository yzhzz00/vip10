/**
 * DLT-AI-CORE VIP
 * Markov Model V5.0 FINAL
 *
 * 一阶马尔可夫转移模型
 */


class MarkovModel {



    constructor(){


        this.name=

        "markov";


    }









    train(

        history=[]

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
         * 统计上一期到下一期
         */


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

                a=>{



                    next.forEach(

                        b=>{



                            if(

                                !transition[a][b]

                            ){



                                transition[a][b]=0;


                            }





                            transition[a][b]++;



                        }

                    );



                }

            );



        }









        /*
         * 当前最新一期
         */


        const last =

        history[

            history.length-1

        ].front;






        const score={};





        for(

            let n=1;

            n<=35;

            n++

        ){



            score[n]=0;



        }









        /*
         * 根据最新号码预测迁移
         */


        last.forEach(

            current=>{



                const map =

                transition[current];





                Object.keys(map)

                .forEach(

                    n=>{



                        score[n]

                        +=

                        map[n];



                    }

                );



            }

        );








        const result=

        Object.keys(score)

        .map(

            n=>({



                number:

                Number(n),



                score:

                score[n]



            })

        )

        .sort(

            (a,b)=>

            b.score-a.score

        );








        return {



            name:

            this.name,



            numbers:

            result,



            top:

            result.slice(

                0,

                10

            )



        };



    }




}



export default MarkovModel;