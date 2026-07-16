function scoreSum(sum){


    if(sum>=80 && sum<=120){

        return 20;

    }


    if(sum>=70 && sum<=130){

        return 10;

    }


    return 5;

}







function scoreOddEven(feature){


    if(
        feature.odd===2 ||
        feature.odd===3
    ){

        return 20;

    }


    if(
        feature.odd===1 ||
        feature.odd===4
    ){

        return 10;

    }


    return 5;

}







function scoreBigSmall(feature){


    if(
        feature.big>=2 &&
        feature.big<=3
    ){

        return 20;

    }


    return 10;

}







function scoreSpan(span){


    if(
        span>=20 &&
        span<=32
    ){

        return 20;

    }


    if(
        span>=15 &&
        span<=35
    ){

        return 10;

    }


    return 5;

}







function scoreConsecutive(value){


    if(value===1){

        return 20;

    }


    if(value===0){

        return 15;

    }


    return 5;

}







function calculateScore(feature){


    let score=0;


    score += scoreSum(
        feature.sum
    );


    score += scoreOddEven(
        feature
    );


    score += scoreBigSmall(
        feature
    );


    score += scoreSpan(
        feature.span
    );


    score += scoreConsecutive(
        feature.consecutive
    );


    return score;

}







function rank(matrix){


    return matrix.map(item=>{


        return {

            issue:item.issue,

            front:item.front,

            back:item.back,

            feature:item.feature,

            score:calculateScore(
                item.feature
            )

        };


    }).sort(
        (a,b)=>
        b.score-a.score
    );


}






module.exports={

    rank,

    calculateScore

};