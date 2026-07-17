// DLT-AI-CORE V11 FINAL
// core/optimizer.js
// 组合优化引擎


class OptimizerEngine {


    constructor(){


        this.limit =
        1000;


    }









    optimize(
        combinations
    ){


        let result =
        [];



        const cache =
        new Set();



        for(
            const item
            of combinations
        ){



            const key =
            this.key(
                item
            );



            if(
                cache.has(key)
            ){


                continue;


            }



            cache.add(key);



            if(
                this.check(
                    item
                )
            ){


                result.push(
                    item
                );


            }



            if(
                result.length
                >=
                this.limit
            ){


                break;


            }


        }



        return result;


    }









    check(
        combination
    ){


        if(
            !combination.front ||
            !combination.back
        ){


            return false;


        }



        if(
            combination.front.length
            !==
            5
        ){


            return false;


        }



        if(
            combination.back.length
            !==
            2
        ){


            return false;


        }



        return true;


    }









    key(
        combination
    ){


        return (

            combination.front
            .join("-")

            +

            "|"

            +

            combination.back
            .join("-")

        );


    }









    top(
        results,
        count=10
    ){


        return results
        .sort(
            (a,b)=>

            b.finalScore
            -
            a.finalScore

        )
        .slice(
            0,
            count
        );


    }



}



export default OptimizerEngine;