// DLT-AI-CORE V11 FINAL
// core/bias.js
// Anti-Human Bias Engine


class BiasEngine {


    constructor(){


        this.name =
        "Anti-Human-Bias";


    }









    calculate(
        combination,
        history
    ){


        let score =
        1;



        score *=
        this.hotBias(
            combination,
            history
        );



        score *=
        this.coldBias(
            combination,
            history
        );



        score *=
        this.patternBias(
            combination
        );



        return this.limit(
            score
        );


    }









    // 追热修正

    hotBias(
        combination,
        history
    ){


        const frequency =
        this.frequency(
            history
        );



        let hotCount =
        0;



        combination.front
        .forEach(
            n=>{


                if(
                    frequency[n]
                    >
                    this.average(
                        frequency
                    )
                ){


                    hotCount++;


                }


            }
        );



        if(
            hotCount >=4
        ){


            return 0.85;


        }



        return 1;


    }









    // 追冷修正

    coldBias(
        combination,
        history
    ){


        const missing =
        {};



        combination.front
        .forEach(
            n=>{


                missing[n]=0;


            }
        );



        let extreme =
        0;



        Object.values(
            missing
        )
        .forEach(
            v=>{


                if(
                    v>50
                ){

                    extreme++;

                }


            }
        );



        if(
            extreme>=3
        ){


            return 0.9;


        }



        return 1;


    }









    // 规律幻想修正

    patternBias(
        combination
    ){


        let score =
        1;



        const nums =
        combination.front;



        let sameTail =
        0;



        const tails =
        nums.map(
            n=>n%10
        );



        tails.forEach(
            t=>{


                if(
                    tails.filter(
                        x=>x===t
                    )
                    .length
                    >=3
                ){


                    sameTail++;


                }


            }
        );



        if(
            sameTail>0
        ){


            score *=0.9;


        }



        return score;


    }









    frequency(history){


        const result =
        {};



        history.forEach(
            d=>{


                d.front
                .forEach(
                    n=>{


                        result[n]=
                        (result[n]||0)+1;


                    }
                );


            }
        );



        return result;


    }









    average(obj){


        const values =
        Object.values(
            obj
        );



        return values.reduce(
            (a,b)=>a+b,
            0
        )
        /
        values.length;


    }









    limit(value){


        return Math.max(
            0.5,
            Math.min(
                1.2,
                value
            )
        );


    }



}



export default BiasEngine;