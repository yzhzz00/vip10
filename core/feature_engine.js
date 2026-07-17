class FeatureEngine {



    constructor(){


        this.features={};


    }






    build(history){



        let frontFreq={};


        let backFreq={};





        for(let i=1;i<=35;i++){

            frontFreq[i]=0;

        }




        for(let i=1;i<=12;i++){

            backFreq[i]=0;

        }






        history.forEach(item=>{



            item.front.forEach(n=>{


                frontFreq[n]++;


            });




            item.back.forEach(n=>{


                backFreq[n]++;


            });



        });







        this.features={



            total:

            history.length,



            frontFrequency:

            frontFreq,



            backFrequency:

            backFreq



        };





        return this.features;



    }






    getFeatures(){


        return this.features;


    }





}



export default new FeatureEngine();