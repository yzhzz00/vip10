// DLT-AI-CORE V11 FINAL
// core/committee.js
// AI模型委员会
// 模型投票 / 权重管理 / 竞争机制


import fs from "fs";


class Committee {


    constructor(){


        this.file =

        "./learning/weights.json";



        this.weights = {


            frequency:1.0,


            trend:0.9,


            bayes:1.0,


            markov:0.9,


            montecarlo:0.8



        };



        this.load();


    }









    load(){


        try{


            if(
                fs.existsSync(
                    this.file
                )
            ){


                const data =

                fs.readFileSync(

                    this.file,

                    "utf-8"

                );



                this.weights =

                {

                    ...this.weights,

                    ...JSON.parse(data)

                };



            }



        }


        catch(error){


            console.log(

                "Committee load error:",

                error.message

            );


        }


    }









    save(){


        try{


            if(
                !fs.existsSync(
                    "./learning"
                )
            ){


                fs.mkdirSync(
                    "./learning"
                );


            }



            fs.writeFileSync(

                this.file,

                JSON.stringify(

                    this.weights,

                    null,

                    2

                )

            );



        }


        catch(error){


            console.log(

                error.message

            );


        }



    }









    vote(models){


        const result={};



        const names =

        Object.keys(

            this.weights

        );






        for(
            const name of names
        ){



            if(
                !models[name]
            )

                continue;





            const weight =

            this.weights[name];





            models[name].slice(

                0,

                20

            )

            .forEach(item=>{



                const number =

                Number(item[0]);



                const score =

                Number(item[1]);



                result[number]

                =

                (

                    result[number]

                    ||

                    0

                )

                +

                score *

                weight;



            });



        }






        return Object.entries(result)

        .sort(

            (a,b)=>

            b[1]-a[1]

        );



    }









    update(model,success){



        if(
            !this.weights[model]
        ){

            return;

        }




        if(success){



            this.weights[model]

            +=

            0.05;



        }

        else{


            this.weights[model]

            -=

            0.05;



        }





        // 权重限制


        if(

            this.weights[model] < 0.1

        )

            this.weights[model]=0.1;




        if(

            this.weights[model] > 2

        )

            this.weights[model]=2;





        this.save();


    }








    status(){


        return this.weights;


    }





}



export default Committee;