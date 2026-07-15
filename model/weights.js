// ==================================================
// V100.1 AI模型权重中心
// ==================================================

"use strict";


window.V100Weights = {



    default:{


        trend:1,


        bayes:1,


        markov:1,


        structure:1,


        montecarlo:1,


        probability:1



    },







    get(){



        let data =

        localStorage.getItem(

            "V100_MODEL_WEIGHTS"

        );





        if(data){


            return JSON.parse(data);


        }





        return this.default;



    },









    save(weights){



        localStorage.setItem(

            "V100_MODEL_WEIGHTS",

            JSON.stringify(weights)

        );



    }




};