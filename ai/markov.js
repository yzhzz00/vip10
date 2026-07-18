import {
    parseDLT
} from "../core/data.js";





function buildMarkovMatrix(){


    const history =
    parseDLT();



    const matrix={};



    if(
        history.length < 2
    ){

        return matrix;

    }






    for(
        let i=0;

        i<history.length-1;

        i++

    ){



        const current =

        history[i].front;



        const next =

        history[i+1].front;






        current.forEach(from=>{


            if(
                !matrix[from]
            ){

                matrix[from]={};

            }





            next.forEach(to=>{


                matrix[from][to] =


                (

                matrix[from][to]

                ||

                0

                )

                +

                1;



            });



        });



    }





    return matrix;


}









function markovScore(number,lastNumbers){



    const matrix =

    buildMarkovMatrix();





    let score=0;





    lastNumbers.forEach(last=>{


        if(
            matrix[last]

            &&

            matrix[last][number]

        ){


            score +=

            matrix[last][number];


        }



    });






    return score;



}









function markovRank(numbers,lastNumbers){



    return numbers.map(

        n=>({


            number:n,


            score:

            markovScore(

                n,

                lastNumbers

            )


        })

    )

    .sort(

        (a,b)=>

        b.score-a.score

    );



}









function getLastDraw(){



    const history =

    parseDLT();



    if(
        history.length===0
    ){

        return [];

    }



    return history[0].front;


}







export {


    buildMarkovMatrix,

    markovScore,

    markovRank,

    getLastDraw

};