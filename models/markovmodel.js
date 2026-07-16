// models/markovModel.js


/*
    马尔可夫转移评分模型
*/



function buildTransition(
    history
){



    const map={};



    for(
        let i=0;
        i<history.length-1;
        i++
    ){


        const current =

        history[i].front;



        const next =

        history[i+1].front;





        current.forEach(
            a=>{


                if(!map[a]){

                    map[a]={};

                }



                next.forEach(
                    b=>{


                        map[a][b]=

                        (
                            map[a][b]||0
                        )

                        +1;


                    }
                );


            }
        );



    }



    return map;


}









function markovModel(
    numbers,
    history
){



    const transition =

    buildTransition(
        history
    );





    const last =

    history[
        history.length-1
    ]
    .front;





    let score=0;



    last.forEach(
        a=>{


            if(
                transition[a]
            ){


                numbers.forEach(
                    b=>{


                        if(
                            transition[a][b]
                        ){

                            score +=

                            transition[a][b];


                        }


                    }
                );


            }


        }
    );





    score =

    Math.min(
        100,
        score
    );





    return {


        score:


        Number(
            score.toFixed(2)
        )



    };



}






module.exports =
markovModel;