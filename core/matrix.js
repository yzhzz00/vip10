// DLT-AI-CORE V11 FINAL
// core/matrix.js
// AI矩阵评分模块
// 号码 × 模型融合


class Matrix {


    build(models){


        const matrix = {};



        // 初始化 1-35

        for(
            let n=1;

            n<=35;

            n++
        ){


            matrix[n]={


                frequency:0,


                trend:0,


                bayes:0,


                markov:0,


                montecarlo:0,


                total:0



            };


        }







        // 写入模型结果


        const names = [


            "frequency",


            "trend",


            "bayes",


            "markov",


            "montecarlo"



        ];







        for(
            const name of names
        ){


            if(
                !models[name]
            )

                continue;




            models[name].forEach(

                item=>{


                    const number =

                    Number(item[0]);



                    const value =

                    Number(item[1]);



                    if(
                        matrix[number]
                    ){



                        matrix[number][name]

                        =

                        value;



                    }



                }

            );



        }








        // 归一化评分


        for(
            const n in matrix
        ){



            const item =

            matrix[n];



            item.total =


            this.normalize(item);



        }






        return matrix;


    }









    normalize(item){



        const values = [


            item.frequency,


            item.trend,


            item.bayes,


            item.markov,


            item.montecarlo



        ];




        const max =

        Math.max(

            ...values,

            1

        );



        let score=0;



        values.forEach(v=>{


            score +=

            v/max;



        });



        return Number(

            score.toFixed(4)

        );



    }









    ranking(matrix){



        return Object.entries(matrix)

        .map(

            ([number,data])=>{


                return [


                    number,


                    data.total



                ];


            }

        )

        .sort(

            (a,b)=>

            b[1]-a[1]

        );


    }





}



export default Matrix;