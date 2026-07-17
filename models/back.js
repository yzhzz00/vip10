// DLT-AI-CORE V11 FINAL
// models/back.js
// 后区预测模型


class BackModel {


    constructor(){


        this.name =
        "back-model";


    }









    async predict(features){


        const frequency =
        features.frequency.back
        ||
        {};



        const scores =
        {};



        for(
            let n=1;
            n<=12;
            n++
        ){


            scores[n] =

            this.frequencyScore(
                frequency[n]
            )

            +

            this.balanceScore(
                n
            );


        }



        return {


            back:
            this.top(
                scores,
                6
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









    balanceScore(number){


        // 后区冷热平衡因子

        if(
            number>=4 &&
            number<=9
        ){


            return 2;


        }



        return 1;


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
        )
        .sort(
            (a,b)=>
            a-b
        );


    }



}



export default BackModel;