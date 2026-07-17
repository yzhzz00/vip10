class DltTheoryModel {


    analyze(history){



        let scores={};



        for(let i=1;i<=35;i++){


            scores[i]=50;


        }





        history

        .slice(-30)

        .forEach(item=>{


            item.front.forEach(n=>{


                scores[n]+=1;


            });



        });





        return {


            name:"dlt_theory",

            scores


        };


    }



}


export default new DltTheoryModel();