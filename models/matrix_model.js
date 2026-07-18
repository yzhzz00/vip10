/**
 * DLT-AI-CORE VIP
 * Matrix Model V5.0 FINAL
 *
 * 前区位置矩阵模型
 */


class MatrixModel {


    constructor(){


        this.name=

        "matrix";


    }









    train(

        history=[]

    ){



        const matrix={};





        /*
         * 初始化5个位置
         */


        for(

            let pos=0;

            pos<5;

            pos++

        ){



            matrix[pos]={};



            for(

                let n=1;

                n<=35;

                n++

            ){


                matrix[pos][n]=0;


            }


        }









        /*
         * 统计历史位置分布
         */


        history.forEach(

            item=>{



                item.front.forEach(

                    (n,pos)=>{



                        matrix[pos][n]++;



                    }

                );



            }

        );









        /*
         * 当前评分
         */


        const score={};





        for(

            let n=1;

            n<=35;

            n++

        ){



            score[n]=0;



        }








        /*
         * 五个位置综合
         */


        Object.keys(

            matrix

        )

        .forEach(

            pos=>{



                Object.keys(

                    matrix[pos]

                )

                .forEach(

                    n=>{



                        score[n]

                        +=

                        matrix[pos][n];



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

                Number(

                    score[n]

                    .toFixed(3)

                )



            })

        )

        .sort(

            (a,b)=>

            b.score-a.score

        );








        return {



            name:

            this.name,



            matrix,



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



export default MatrixModel;