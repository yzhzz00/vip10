// DLT-AI-CORE V11 FINAL
// core/feature.js
// 特征生成引擎


import TheoryEngine from "./theory.js";



class FeatureEngine {


    constructor(){


        this.theory =
        new TheoryEngine();


    }







    generate(history){


        const latest =
        history[
            history.length-1
        ];



        return {


            basic:
            this.basic(
                history
            ),


            theory:
            this.theory.analyze(
                latest
            ),


            frequency:
            this.frequency(
                history
            ),


            missing:
            this.missing(
                history
            )


        };


    }









    basic(history){


        return {


            total:
            history.length,


            latest:
            history[
                history.length-1
            ]


        };


    }









    frequency(history){


        const front = {};

        const back = {};



        history.forEach(
            draw=>{


                draw.front.forEach(
                    n=>{


                        front[n] =
                        (front[n]||0)+1;


                    }
                );



                draw.back.forEach(
                    n=>{


                        back[n] =
                        (back[n]||0)+1;


                    }
                );


            }
        );



        return {


            front,


            back



        };


    }









    missing(history){


        const lastIndex =
        history.length-1;



        const frontMissing =
        {};



        for(
            let n=1;
            n<=35;
            n++
        ){


            frontMissing[n]=
            this.findMissing(
                history,
                n,
                "front"
            );


        }



        return {


            front:
            frontMissing


        };


    }









    findMissing(
        history,
        number,
        type
    ){


        let count=0;



        for(
            let i=history.length-1;
            i>=0;
            i--
        ){


            if(
                history[i][type]
                .includes(number)
            ){


                break;


            }



            count++;


        }



        return count;


    }



}



export default FeatureEngine;