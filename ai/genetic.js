function score(combo,model){


    let value=0;



    combo.forEach(n=>{


        value +=

        model[n] || 0;


    });



    return value;


}





function evolve(
population,
model
){


    return population

    .map(item=>({


        combo:item,


        score:

        score(
            item,
            model
        )


    }))


    .sort(

        (a,b)=>

        b.score-a.score

    );


}




function top(population,count=10){


    return population

    .slice(0,count);


}



export {

evolve,

top

};