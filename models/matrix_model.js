/**
 * DLT-AI-CORE VIP
 * Matrix Model V2.0
 *
 * 数字位置矩阵模型
 */


class MatrixModel {



    constructor(){


        this.name =
        "matrix";


    }








    train(

        history=[],

        features={}

    ){



        /*
         * 五个前区位置
         *
         * position[0-4]
         *
         */


        const matrix = [

            {},

            {},

            {},

            {},

            {}

        ];







        for(

            let pos=0;

            pos<5;

            pos++

        ){



            for(

                let num=1;

                num<=35;

                num++

            ){


                matrix[pos][num]=0;


            }



        }







        /*
         * 建立位置矩阵
         */


        history.forEach(

            item=>{



                item.front

                .forEach(

                    (num,index)=>{


                        matrix[index][num]++;


                    }

                );



            }

        );








        const scores=[];







        for(

            let num=1;

            num<=35;

            num++

        ){



            let score=0;





            matrix.forEach(

                position=>{


                    score +=

                    position[num]

                    ||

                    0;


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








        return {



            name:this.name,



            matrix,



            numbers:

            scores.sort(

                (a,b)=>

                b.score-a.score

            )



        };



    }






}



export default MatrixModel;