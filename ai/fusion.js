function fusionScore(models){


    const result={};



    Object.values(models)

    .forEach(model=>{


        Object.entries(model)

        .forEach(([num,score])=>{


            result[num]=

            (result[num]||0)

            +

            score;



        });



    });



    return Object.entries(result)

    .sort(

        (a,b)=>b[1]-a[1]

    );

}



export {

    fusionScore

};