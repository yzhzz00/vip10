import {
    parseDLT
} from "../core/data.js";





function buildFrequency(){


    const history =
    parseDLT();



    const frequency={};



    history.forEach(item=>{


        item.front.forEach(num=>{


            frequency[num] =

            (frequency[num] || 0)

            +

            1;


        });


    });




    return {


        frequency,


        total:

        history.length


    };

}







function bayesianScore(number){



    const data =
    buildFrequency();



    if(
        !data.total
    ){

        return 0;

    }




    const count =

    data.frequency[number]

    ||

    0;






    // 平滑贝叶斯概率

    const probability =


    (count + 1)

    /

    (

    data.total + 1

    );







    return Number(

        (

        probability

        *

        100

        )

        .toFixed(3)

    );



}








function bayesianRank(numbers){



    return numbers.map(

        n=>({


            number:n,


            score:

            bayesianScore(n)


        })

    )

    .sort(

        (a,b)=>

        b.score-a.score

    );


}








export {


    bayesianScore,

    bayesianRank,

    buildFrequency

};