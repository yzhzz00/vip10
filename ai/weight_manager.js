import fs from "fs";


class WeightManager {


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

        }

        catch(e){



            this.weights={};



        }



    }









    init(models){



        if(

            Object.keys(

                this.weights

            ).length>0

        )

        return;





        let value=

        Number(

            (

            1/models.length

            )

            .toFixed(4)

        );






        models.forEach(m=>{


            this.weights[m]=value;



        });




        this.save();



    }









    update(name,value){



        if(

            !this.weights[name]

        )

        return;



        this.weights[name]+=value;



        this.normalize();



        this.save();



    }









    normalize(){



        let total=

        Object.values(

            this.weights

        )

        .reduce(

            (a,b)=>a+b,

            0

        );




        Object.keys(

            this.weights

        )

        .forEach(k=>{


            this.weights[k]=

            Number(

                (

                this.weights[k]/total

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






    get(){


        return this.weights;


    }



}



export default new WeightManager();