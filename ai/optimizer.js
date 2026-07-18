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



    // 免费服务器优化版

    // 先生成5000个候选

    const population =


    runSimulation(

        pool,

        5000

    )

    .map(item=>


        item.slice(
            0,
            size
        )


    );





    if(
        population.length===0
    ){


        return [];


    }






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