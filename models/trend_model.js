class TrendModel {


    analyze(history){


        let scores={};



        for(let i=1;i<=35;i++){

            scores[i]=0;

        }





        let recent=

        history.slice(-100);





        recent.forEach((item,index)=>{


            item.front.forEach(n=>{


                scores[n]+=

                index+1;


            });



        });





        return {


            name:"trend",

            scores


        };



    }


}


export default new TrendModel();