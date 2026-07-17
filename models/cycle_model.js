class CycleModel {


    analyze(history){


        let scores={};



        for(let i=1;i<=35;i++){

            scores[i]=50;

        }





        history

        .slice(-50)

        .forEach(item=>{


            item.front.forEach(n=>{


                scores[n]+=2;


            });



        });






        return {


            name:"cycle",

            scores


        };



    }


}



export default new CycleModel();