function sumScore(combo,score){


    let total=0;



    combo.forEach(n=>{


        total +=

        score[n] || 0;


    });



    return total;


}



function rankCombination(
combos,
score
){


    return combos

    .map(c=>({


        numbers:c,


        score:

        sumScore(
            c,
            score
        )


    }))


    .sort(

        (a,b)=>

        b.score-a.score

    );


}



export {


    rankCombination

};