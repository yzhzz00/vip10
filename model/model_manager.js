let models={};



function register(
name,
score
){


    models[name]={

        score,

        update:
        Date.now()

    };


}



function ranking(){


    return Object.entries(models)

    .sort(

        (a,b)=>

        b[1].score-a[1].score

    );


}



function getBest(){


    return ranking()[0];

}



export {

    register,

    ranking,

    getBest

};