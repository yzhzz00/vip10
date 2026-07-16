// learning/weightAdjust.js



function normalize(
    weights
){


    const total=

    Object.values(weights)

    .reduce(
        (a,b)=>a+b,
        0
    );



    Object.keys(weights)

    .forEach(
        key=>{


            weights[key]=

            Number(

                (
                weights[key]
                /
                total
                )

                .toFixed(3)

            );


        }
    );



    return weights;

}









function weightAdjust(
    weights,
    performance
){



    const result={

        ...weights

    };





    Object.keys(performance)

    .forEach(
        key=>{


            if(
                performance[key]>=80
            ){

                result[key]*=1.05;

            }


            else if(
                performance[key]<60
            ){

                result[key]*=0.95;

            }


        }
    );





    return normalize(
        result
    );


}





module.exports =
weightAdjust;