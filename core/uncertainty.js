// DLT-AI-CORE V11 FINAL
// core/uncertainty.js
// 预测可信度分析


class UncertaintyEngine {


    constructor(){


        this.version =
        "uncertainty-v1";


    }









    analyze(
        predictions
    ){


        if(
            !predictions ||
            predictions.length===0
        ){


            return {


                confidence:
                0,


                risk:
                "high"



            };


        }



        const agreement =
        this.agreement(
            predictions
        );



        const confidence =
        this.calculate(
            agreement
        );



        return {


            agreement,


            confidence,


            risk:
            this.risk(
                confidence
            )



        };


    }









    agreement(
        predictions
    ){


        let count =
        0;



        for(
            let i=0;
            i<predictions.length;
            i++
        ){


            for(
                let j=i+1;
                j<predictions.length;
                j++
            ){


                if(
                    this.same(
                        predictions[i],
                        predictions[j]
                    )
                ){


                    count++;


                }


            }


        }



        const total =

        predictions.length
        *
        (predictions.length-1)
        /
        2;



        return total
        ?
        count/total
        :
        0;


    }









    same(
        a,
        b
    ){


        const af =
        a.front.join(",");



        const bf =
        b.front.join(",");



        return af===bf;


    }









    calculate(
        agreement
    ){


        return Number(

            (
                agreement
                *
                100
            )
            .toFixed(2)

        );


    }









    risk(
        confidence
    ){


        if(
            confidence>=70
        ){


            return "low";


        }



        if(
            confidence>=40
        ){


            return "medium";


        }



        return "high";


    }



}



export default UncertaintyEngine;