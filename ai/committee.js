class Committee {



    combine(models,weights){



        let scores={};



        for(let n=1;n<=35;n++){


            scores[n]=0;


        }







        models.forEach(model=>{



            let w=

            weights[model.name]

            ||

            0.1;






            Object.keys(

                model.scores

            )

            .forEach(n=>{



                scores[n]+=

                model.scores[n]

                *

                w;



            });



        });







        return scores;



    }



}



export default new Committee();