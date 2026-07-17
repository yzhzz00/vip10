// DLT-AI-CORE V11 FINAL
// models/markov.js
// 一阶马尔可夫转移模型


class MarkovModel {


    constructor(){


        this.name =
        "markov";


        this.history =
        [];


    }









    async train(history){


        this.history =
        history;



        return true;


    }









    async predict(features){


        const front =
        this.transition(
            35,
            "front"
        );



        const back =
        this.transition(
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









    transition(
        max,
        type
    ){


        const matrix =
        {};



        for(
            let i=1;
            i<=max;
            i++
        ){


            matrix[i]={};


        }



        for(
            let i=1;
            i<this.history.length;
            i++
        ){


            const previous =
            this.history[i-1][type];



            const current =
            this.history[i][type];



            previous.forEach(
                a=>{


                    current.forEach(
                        b=>{


                            matrix[a][b]
                            =
                            (
                                matrix[a][b]
                                ||
                                0
                            )
                            +1;


                        }
                    );


                }
            );


        }



        return this.nextScore(
            matrix,
            max
        );


    }









    nextScore(
        matrix,
        max
    ){


        const score =
        {};



        for(
            let i=1;
            i<=max;
            i++
        ){


            score[i]=0;



            Object.values(
                matrix
            )
            .forEach(
                row=>{


                    score[i]
                    +=
                    row[i]
                    ||
                    0;


                }
            );


        }



        return score;


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



export default MarkovModel;