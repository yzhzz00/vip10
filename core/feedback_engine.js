import fs from "fs";


class FeedbackEngine {


    constructor(){


        this.file=

        "./storage/feedback.json";


        this.records=[];


        this.load();


    }






    load(){


        try{


            if(

                fs.existsSync(

                    this.file

                )

            ){


                this.records=

                JSON.parse(

                    fs.readFileSync(

                        this.file,

                        "utf8"

                    )

                );


            }



        }catch(e){


            this.records=[];


        }



    }








    save(){



        fs.writeFileSync(

            this.file,

            JSON.stringify(

                this.records,

                null,

                2

            )

        );


    }









    add(record){



        let data={


            issue:

            record.issue,



            date:

            record.date || new Date(),



            front:

            record.front,



            back:

            record.back,



            prediction:

            record.prediction || [],



            hit:

            this.compare(

                record.prediction,

                {

                    front:

                    record.front,


                    back:

                    record.back

                }

            )



        };




        this.records.push(data);



        this.save();



        return data;



    }









    compare(prediction,result){



        if(!prediction)

        return {

            front:0,

            back:0

        };




        let front=0;

        let back=0;






        prediction.forEach(p=>{



            p.front.forEach(n=>{


                if(

                    result.front.includes(n)

                )

                front++;



            });





            p.back.forEach(n=>{


                if(

                    result.back.includes(n)

                )

                back++;



            });



        });






        return {


            front,


            back



        };


    }









    getAll(){


        return this.records;


    }



}



export default new FeedbackEngine();