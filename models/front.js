// DLT-AI-CORE V11 FINAL
// models/front.js
// 前区预测模型


class FrontModel {


    constructor(){


        this.name =
        "front-model";


    }









    async predict(features){


        const frequency =
        features.frequency.front
        ||
        {};



        const missing =
        features.missing.front
        ||
        {};



        const scores =
        {};



        for(
            let n=1;
            n<=35;
            n++
        ){


            scores[n] =

            this.frequencyScore(
                frequency[n]
            )

            +

            this.missingScore(
                missing[n]
            );


        }



        return {


            front:
            this.top(
                scores,
                10
            ),


            scores



        };


    }









    frequencyScore(value){


        if(
            !value
        ){

            return 0;

        }



        return value;


    }









    missingScore(value){


        if(
            !value
        ){

            return 0;

        }



        return Math.min(
            value,
            20
        )
        *
        0.3;


    }









    top(
        data,
        count
    ){


        return Object.entries(
            data
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
            Number(item[0])
        );


    }



}



export default FrontModel;