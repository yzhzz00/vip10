// DLT-AI-CORE V11 FINAL
// core/matrix.js
// 矩阵融合引擎


class MatrixEngine {


    constructor(){


        this.version =
        "matrix-v1";


    }









    calculate(
        feature,
        weight,
        feedback,
        theory=1,
        bias=1,
        confidence=1
    ){


        const base =
        this.multiply(
            feature,
            weight,
            feedback
        );



        return (


            base
            *
            theory
            *
            bias
            *
            confidence


        );


    }









    multiply(
        feature,
        weight,
        feedback
    ){


        let result =
        0;



        const keys =
        Object.keys(
            weight
        );



        keys.forEach(
            key=>{


                const f =
                feature[key]
                ||
                0;



                const w =
                weight[key]
                ||
                0;



                const r =
                feedback[key]
                ||
                1;



                result +=
                f
                *
                w
                *
                r;



            }
        );



        return result;


    }









    normalize(value){


        return Number(
            value.toFixed(6)
        );


    }









    buildFeatureMatrix(data){


        return {


            frequency:
            data.frequency
            ||
            0,


            trend:
            data.trend
            ||
            0,


            bayes:
            data.bayes
            ||
            0,


            markov:
            data.markov
            ||
            0,


            montecarlo:
            data.montecarlo
            ||
            0



        };


    }









    buildWeightMatrix(models){


        return {


            frequency:
            models.frequency
            ||
            0,


            trend:
            models.trend
            ||
            0,


            bayes:
            models.bayes
            ||
            0,


            markov:
            models.markov
            ||
            0,


            montecarlo:
            models.montecarlo
            ||
            0



        };


    }



}



export default MatrixEngine;