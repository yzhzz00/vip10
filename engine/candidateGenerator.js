// engine/candidateGenerator.js


/*
    候选生成模块

*/


function randomPick(arr,num){


    const copy=[...arr];


    const result=[];


    while(result.length<num){


        const index=

        Math.floor(
            Math.random()*copy.length
        );


        const value=

        copy.splice(
            index,
            1
        )[0];


        result.push(value);


    }


    return result.sort(
        (a,b)=>a-b
    );


}








function createFront(){



    const pool=[];



    for(
        let i=1;
        i<=35;
        i++
    ){

        pool.push(i);

    }



    return randomPick(
        pool,
        5
    );

}


function createBack(){


    const pool=[];


    for(
        let i=1;
        i<=12;
        i++
    ){

        pool.push(i);

    }


    return randomPick(
        pool,
        2
    );

}





function candidateGenerator(
    prediction,
    count=5000
){



    const result=[];



    for(
        let i=0;
        i<count;
        i++
    ){


        result.push({


            front:
            createFront(),


            back:
            createBack()


        });



    }



    return result;


}




module.exports =
candidateGenerator;