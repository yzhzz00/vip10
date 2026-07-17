// DLT-AI-CORE V11 FINAL
// core/validation.js
// 自动回测引擎


class ValidationEngine {


    constructor(){


        this.results = [];


    }









    run(
        history,
        predictor,
        window=100
    ){


        this.results = [];



        for(
            let i=window;
            i<history.length;
            i++
        ){


            const train =
            history.slice(
                0,
                i
            );



            const actual =
            history[i];



            const prediction =
            predictor(
                train
            );



            const score =
            this.compare(
                prediction,
                actual
            );



            this.results.push({

                index:i,

                score

            });



        }



        return this.summary();


    }









    compare(
        prediction,
        actual
    ){


        let frontHit = 0;

        let backHit = 0;



        prediction.front
        .forEach(
            n=>{


                if(
                    actual.front
                    .includes(n)
                ){


                    frontHit++;


                }


            }
        );



        prediction.back
        .forEach(
            n=>{


                if(
                    actual.back
                    .includes(n)
                ){


                    backHit++;


                }


            }
        );



        return {


            frontHit,

            backHit,

            total:
            frontHit+
            backHit



        };


    }









    summary(){


        let total = 0;



        this.results
        .forEach(
            r=>{


                total +=
                r.score.total;


            }
        );



        return {


            tests:
            this.results.length,


            average:
            this.results.length
            ?
            total /
            this.results.length
            :
            0,


            detail:
            this.results



        };


    }









    getResults(){


        return this.results;


    }



}



export default ValidationEngine;