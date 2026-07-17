// DLT-AI-CORE V11 FINAL
// models/trend.js
// 趋势分析模型


class TrendModel {


    constructor(){


        this.name =
        "trend";


        this.window =
        100;


        this.history =
        [];


    }









    async train(history){


        this.history =
        history;



        return true;


    }









    async predict(features){


        const recent =

        this.history.slice(
            -this.window
        );



        const front =
        this.calculate(
            recent,
            "front",
            35
        );



        const back =
        this.calculate(
            recent,
            "back",
            12
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
        history,
        type,
        max
    ){


        const scores =
        {};



        for(
            let i=1;
            i<=max;
            i++
        ){


            scores[i]=0;


        }



        history.forEach(
            (draw,index)=>{


                const weight =
                index+1;



                draw[type]
                .forEach(
                    n=>{


                        scores[n]
                        +=
                        weight;


                    }
                );


            }
        );



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



export default TrendModel;