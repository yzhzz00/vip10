class ModelEngine {


    constructor(){


        this.status={};


        this.weights={};


    }




    train(history){



        let models=[


            "frequency",

            "trend",

            "bayes",

            "markov",

            "omission",

            "cycle",

            "matrix",

            "theory"



        ];




        models.forEach((m,index)=>{


            this.status[m]={


                state:"complete",

                progress:100


            };



            this.weights[m]=

            Number(

                (

                100/models.length

                )

                .toFixed(2)

            );



        });



        return {


            models,


            weights:this.weights



        };



    }




    getStatus(){


        return this.status;


    }



}




export default new ModelEngine();