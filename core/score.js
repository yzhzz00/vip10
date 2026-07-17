// DLT-AI-CORE V11 FINAL
// core/score.js
// 综合评分模块
// 模型 + 矩阵 + 委员会 + 大乐透理论


import config from "../config.js";


class Score {



    calculate(input){



        const {


            models,

            matrix,

            committee,

            theory


        } = input;





        const score={};






        // =====================
        // 1.委员会评分
        // =====================


        if(
            committee
        ){



            committee.forEach(

                item=>{


                    const n =

                    Number(item[0]);



                    score[n]=


                    (

                        score[n]

                        ||

                        0

                    )

                    +

                    Number(item[1])

                    *

                    0.5;



                }

            );



        }








        // =====================
        // 2.矩阵评分
        // =====================


        if(
            matrix
        ){



            Object.entries(matrix)

            .forEach(

                ([n,data])=>{



                    score[n]=


                    (

                        score[n]

                        ||

                        0

                    )

                    +

                    data.total *

                    10;



                }

            );



        }








        // =====================
        // 3.理论修正
        // =====================


        this.theoryAdjust(

            score,

            theory

        );








        return Object.entries(score)

        .sort(

            (a,b)=>

            b[1]-a[1]

        );



    }









    theoryAdjust(score,theory){



        if(
            !theory
        )

            return;







        // 遗漏增强

        if(
            theory.omission
        ){



            Object.entries(

                theory.omission

            )

            .forEach(

                ([n,miss])=>{



                    if(
                        miss>=8
                    ){



                        score[n]

                        =

                        (

                            score[n]

                            ||

                            0

                        )

                        +

                        miss *

                        0.15;



                    }



                }

            );



        }







        // 和值范围控制

        // 防止极端号码组合

        return score;



    }









    generate(ranking){



        const result=[];



        for(
            const item of ranking
        ){



            const n =

            Number(item[0]);



            if(
                !result.includes(n)
            ){


                result.push(n);


            }




            if(
                result.length===5
            )

                break;



        }







        return result.sort(

            (a,b)=>

            a-b

        );



    }








    generateBack(history){



        const map={};



        history.forEach(item=>{


            item.back.forEach(n=>{


                map[n]=

                (map[n]||0)+1;


            });


        });





        return Object.entries(map)

        .sort(

            (a,b)=>

            b[1]-a[1]

        )

        .slice(

            0,

            2

        )

        .map(

            x=>

            Number(x[0])

        );


    }





}



export default Score;