// DLT-AI-CORE V11 FINAL
// core/score.js
// FinalScore计算引擎


import MatrixEngine from "./matrix.js";
import BiasEngine from "./bias.js";



class ScoreEngine {


    constructor(){


        this.matrix =
        new MatrixEngine();


        this.bias =
        new BiasEngine();


    }









    calculate(data){


        const {

            feature,
            weight,
            feedback,
            combination,
            theoryScore,
            confidence

        } = data;



        const matrixScore =
        this.matrix.calculate(

            feature,

            weight,

            feedback,

            theoryScore,

            1,

            confidence

        );



        const biasScore =
        this.bias.calculate(

            combination,

            data.history

        );



        const finalScore =
        matrixScore
        *
        biasScore;



        return {


            matrixScore:

            this.round(
                matrixScore
            ),



            biasScore:

            this.round(
                biasScore
            ),



            finalScore:

            this.round(
                finalScore
            )


        };


    }









    rank(results){


        return results.sort(
            (a,b)=>

            b.finalScore
            -
            a.finalScore

        );


    }









    normalize(score){


        return Math.max(
            0,
            Math.min(
                100,
                score
            )
        );


    }









    round(value){


        return Number(
            value.toFixed(4)
        );


    }



}



export default ScoreEngine;