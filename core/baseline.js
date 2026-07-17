// DLT-AI-CORE V11 FINAL
// core/baseline.js
// 随机基线对照系统


class BaselineEngine {


    constructor(){


        this.name =
        "random-baseline";


    }









    generate(){


        return {


            front:
            this.randomNumbers(
                35,
                5
            ),


            back:
            this.randomNumbers(
                12,
                2
            )


        };


    }









    randomNumbers(
        max,
        count
    ){


        const result =
        new Set();



        while(
            result.size
            <
            count
        ){


            const num =
            Math.floor(
                Math.random()
                *
                max
            )
            +1;



            result.add(
                num
            );


        }



        return Array.from(
            result
        )
        .sort(
            (a,b)=>a-b
        );


    }









    compare(
        modelResults,
        baselineResults
    ){


        return {


            modelAverage:

            this.average(
                modelResults
            ),



            baselineAverage:

            this.average(
                baselineResults
            ),



            advantage:

            this.average(
                modelResults
            )
            -
            this.average(
                baselineResults
            )



        };


    }









    average(values){


        if(
            !values.length
        ){

            return 0;

        }



        return values.reduce(
            (a,b)=>a+b,
            0
        )
        /
        values.length;


    }



}



export default BaselineEngine;