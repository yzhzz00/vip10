// engine/rankingEngine.js



function rankingEngine(
    list,
    limit=10
){



    return list

    .sort(

        (a,b)=>

        b.finalScore
        -
        a.finalScore

    )

    .slice(
        0,
        limit
    )

    .map(

        (item,index)=>(

        {

            rank:
            index+1,


            front:
            item.front,


            back:
            item.back,


            score:
            item.finalScore


        }

        )

    );


}




module.exports =
rankingEngine;