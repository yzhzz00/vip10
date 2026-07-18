import {
    runSimulation
} from "./montecarlo.js";


import {
    evolve,
    top
} from "./genetic.js";



function optimize(
    pool,
    model,
    count = 10,
    size = 5
){

    const population =

    runSimulation(
        pool,
        50000
    )
    .map(item=>

        item.slice(0,size)

    );



    const ranked =

    evolve(
        population,
        model
    );


    return top(
        ranked,
        count
    );


}



export {

    optimize

};