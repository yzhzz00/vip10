function bayesianScore(history){


    const count={};


    history.forEach(n=>{


        count[n]=(count[n]||0)+1;


    });



    const total=history.length;



    const score={};



    Object.keys(count)
    .forEach(n=>{


        score[n]=

        count[n]/total;



    });



    return score;


}



function rank(score){


    return Object.entries(score)

    .sort(

        (a,b)=>b[1]-a[1]

    );


}



export {


    bayesianScore,

    rank

};