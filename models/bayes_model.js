class BayesModel {


    analyze(features){


        let scores={};



        let freq=

        features.frontFrequency;



        let total=

        features.total*5;





        for(let n=1;n<=35;n++){



            scores[n]=

            Number(

                (

                freq[n]/total*100

                )

                .toFixed(2)

            );


        }



        return {


            name:"bayes",

            scores


        };


    }



}



export default new BayesModel();