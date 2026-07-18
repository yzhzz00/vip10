import {

parseDLT

} from "../core/data.js";





let cache = null;

let cacheTime = 0;







function randomSelect(arr,count){



    const pool=[...arr];


    const result=[];



    while(

        result.length<count

        &&

        pool.length>0

    ){



        const index=

        Math.floor(

            Math.random()

            *

            pool.length

        );



        result.push(

            pool[index]

        );



        pool.splice(

            index,

            1

        );


    }



    return result.sort(

        (a,b)=>a-b

    );

}









function buildPool(){



    const history=

    parseDLT();



    const set=

    new Set();



    history.forEach(item=>{


        item.front.forEach(num=>{


            set.add(num);


        });


    });





    return Array.from(set);



}









function validStructure(numbers){



    const odd=

    numbers.filter(

        n=>n%2!==0

    ).length;



    const sum=

    numbers.reduce(

        (a,b)=>a+b,

        0

    );







    if(

        odd===0

        ||

        odd===5

    ){

        return false;

    }






    if(

        sum<40

        ||

        sum>170

    ){

        return false;

    }





    return true;


}









function runSimulation(
    times=10000
){



    const now=

    Date.now();



    if(

        cache

        &&

        now-cacheTime

        <

        60000

    ){


        return cache;


    }







    const pool=

    buildPool();





    const result={};





    for(

        let i=0;

        i<times;

        i++

    ){



        const numbers=

        randomSelect(

            pool,

            5

        );





        if(

            !validStructure(numbers)

        ){

            continue;

        }





        const key=

        numbers.join(",");





        result[key]=

        (

        result[key]

        ||

        0

        )

        +

        1;



    }







    cache =


    Object.entries(

        result

    )

    .map(item=>{


        return {


            numbers:

            item[0]

            .split(",")

            .map(Number),



            frequency:

            item[1]


        };


    })

    .sort(

        (a,b)=>

        b.frequency-a.frequency

    );






    cacheTime=

    now;



    return cache;



}









function monteCarloScore(numbers){



    const list=

    runSimulation(

        10000

    );



    const key=

    numbers.join(",");





    const item=

    list.find(

        x=>

        x.numbers.join(",")

        ===

        key

    );






    if(!item){



        return 0;


    }





    return item.frequency;



}









function getSimulationTop(){



    return runSimulation(

        10000

    )

    .slice(

        0,

        20

    );



}









export {


    runSimulation,


    monteCarloScore,


    getSimulationTop


};