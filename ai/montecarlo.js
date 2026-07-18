import {

    validCombination

} from "./filter.js";





function create(pool,count){



    const temp=[...pool];

    const result=[];




    while(

        result.length<count

        &&

        temp.length>0

    ){



        const index=

        Math.floor(

            Math.random()

            *

            temp.length

        );





        result.push(

            temp[index]

        );





        temp.splice(

            index,

            1

        );



    }




    return result.sort(

        (a,b)=>a-b

    );



}







function runSimulation(

    pool,

    times=5000

){



    const result=[];



    let attempts=0;



    const maxAttempts=

    times*20;







    while(

        result.length<times

        &&

        attempts<maxAttempts

    ){



        const combo=

        create(

            pool,

            5

        );




        if(

            validCombination(

                combo

            )

        ){



            result.push(

                combo

            );



        }





        attempts++;



    }







    // 如果过滤不足

    // 返回已有结果

    if(

        result.length===0

    ){



        for(

            let i=0;

            i<100;

            i++

        ){



            result.push(

                create(

                    pool,

                    5

                )

            );


        }


    }





    return result;



}






export {

    runSimulation

};