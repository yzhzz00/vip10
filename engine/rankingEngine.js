// engine/rankingEngine.js


/*
    DLT-AI CORE V1.0

    Ranking Engine

    功能:

    AI评分结果

        ↓

    TOP排名结果


*/



function formatNumbers(numbers){


    return numbers
    .map(
        n=>
        String(n)
        .padStart(2,"0")
    )
    .join(" ");

}







function getLevel(score){


    if(score>=90){

        return "A+";

    }


    if(score>=80){

        return "A";

    }


    if(score>=70){

        return "B";

    }


    return "C";


}









function getSupportModels(scores){


    const result=[];



    Object.keys(scores)
    .forEach(
        key=>{


            if(
                scores[key]
                &&
                scores[key].score>=80
            ){

                result.push(
                    key
                );

            }


        }
    );



    return result;


}









function rankingEngine(
    results,
    limit=10
){



    return results

    .slice(
        0,
        limit
    )

    .map(
        (item,index)=>{


            return {


                rank:
                index+1,



                number:


                `${formatNumbers(item.front)}

                 +

                 ${formatNumbers(item.back)}`,



                front:
                item.front,



                back:
                item.back,



                score:
                item.finalScore,



                level:
                getLevel(
                    item.finalScore
                ),



                support:

                getSupportModels(
                    item.scores
                )


            };


        }

    );



}





module.exports =
rankingEngine;