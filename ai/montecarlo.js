import {

validCombination

} from "./filter.js";





function create(pool,count){


    const temp=[...pool];

    const result=[];



    while(result.length<count){


        const index=

        Math.floor(
            Math.random()*temp.length
        );



        result.push(
            temp[index]
        );


        temp.splice(index,1);


    }



    return result.sort(
        (a,b)=>a-b
    );

}





function runSimulation(
pool,
times=100000
){


    const result=[];



    let i=0;



    while(i<times){


        const combo=

        create(pool,5);



        if(validCombination(combo)){


            result.push(combo);


            i++;


        }


    }



    return result;


}





export {

runSimulation

};