import fs from "fs";


class LearningEngine {



    constructor(){



        this.file=

        "./storage/model_weight.json";



        this.weights={};



        this.load();



    }







    load(){


        try{


            if(

                fs.existsSync(

                    this.file

                )

            ){



                this.weights=

                JSON.parse(

                    fs.readFileSync(

                        this.file,

                        "utf8"

                    )

                );


            }



        }catch(e){


            this.weights={};


        }



    }









    update(hit){



        let reward=

        hit.front+

        hit.back;





        Object.keys(

            this.weights

        )

        .forEach(model=>{



            if(reward>=3){


                this.weights[model]+=0.01;



            }

            else{


                this.weights[model]-=0.005;



            }



        });






        this.normalize();



        this.save();



        return this.weights;



    }









    normalize(){



        let sum=

        Object.values(

            this.weights

        )

        .reduce(

            (a,b)=>a+b,

            0

        );





        if(sum===0)

        return;





        Object.keys(

            this.weights

        )

        .forEach(k=>{


            this.weights[k]=

            Number(

                (

                this.weights[k]/sum

                )

                .toFixed(4)

            );



        });



    }









    save(){



        fs.writeFileSync(

            this.file,

            JSON.stringify(

                this.weights,

                null,

                2

            )

        );


    }







    getWeights(){


        return this.weights;


    }




}



export default new LearningEngine();