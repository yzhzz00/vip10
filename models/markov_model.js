class MarkovModel {


    analyze(history){



        let scores={};



        for(let i=1;i<=35;i++){

            scores[i]=0;

        }





        for(

            let i=1;

            i<history.length;

            i++

        ){



            let last=

            history[i-1].front;



            let current=

            history[i].front;





            last.forEach(a=>{


                current.forEach(b=>{


                    if(!scores[b])

                    scores[b]=0;



                    scores[b]+=1;


                });



            });



        }






        return {


            name:"markov",

            scores


        };



    }



}



export default new MarkovModel();