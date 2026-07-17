// DLT-AI-CORE V11 FINAL
// models/bayes.js
// 贝叶斯概率模型


class BayesModel {


    constructor(){


        this.name =
        "bayes";


        this.history =
        [];


        this.alpha =
        1;


    }









    async train(history){


        this.history =
        history;



        return true;


    }









    async predict(features){


        const front =

        this.calculate(
            35,
            "front"
        );



        const back =

        this.calculate(
            12,
            "back"
        );



        return {


            front:
            this.top(
                front,
                10
            ),


            back:
            this.top(
                back,
                5
            ),


            scores:{
                front,
                back
            }



        };


    }









    calculate(
        max,
        type
    ){


        const scores =
        {};



        const total =

        this.history.length
        +
        this.alpha
        *
        max;



        for(
            let n=1;
            n<=max;
            n++
        ){


            let count =
            0;



            this.history
            .forEach(
                draw=>{


                    if(
                        draw[type]
                        .includes(n)
                    ){


                        count++;


                    }


                }
            );



            scores[n] =

            (

                count
                +
                this.alpha

            )
            /
            total;



        }



        return scores;


    }









    top(
        scores,
        count
    ){


        return Object.entries(
            scores
        )
        .sort(
            (a,b)=>

            b[1]-a[1]

        )
        .slice(
            0,
            count
        )
        .map(
            item=>

            Number(
                item[0]
            )

        )
        .sort(
            (a,b)=>

            a-b

        );


    }



}



export default BayesModel;