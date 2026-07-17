// DLT-AI-CORE V11 FINAL
// core/feedback.js
// 开奖反馈 / AI学习模块


import fs from "fs";


class Feedback {


    constructor(){


        this.file =

        "./learning/feedback.json";



        this.history = [];



        this.load();


    }








    load(){


        try{


            if(

                fs.existsSync(

                    this.file

                )

            ){


                this.history =

                JSON.parse(

                    fs.readFileSync(

                        this.file,

                        "utf-8"

                    )

                );


            }



        }


        catch(error){


            this.history=[];


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

                    this.history,

                    null,

                    2

                )

            );



        }


        catch(error){


            console.log(

                "Feedback save error:",

                error.message

            );


        }



    }








    add(prediction,result){



        const record = {


            time:

            new Date(),



            prediction,



            result,



            hit:

            this.calculateHit(

                prediction,

                result

            )



        };





        this.history.push(

            record

        );



        this.save();



        return record;



    }









    calculateHit(prediction,result){



        if(

            !prediction ||

            !result

        )

            return {};





        const frontHit =

        prediction.front.filter(

            n=>

            result.front.includes(n)

        );



        const backHit =

        prediction.back.filter(

            n=>

            result.back.includes(n)

        );





        return {


            front:

            frontHit.length,



            back:

            backHit.length,



            total:

            frontHit.length

            +

            backHit.length



        };


    }









    getStatus(){


        let total=0;



        let front=0;



        let back=0;




        this.history.forEach(item=>{


            total++;



            front +=

            item.hit.front || 0;



            back +=

            item.hit.back || 0;



        });






        return {


            learningTimes:

            total,



            frontHits:

            front,



            backHits:

            back



        };



    }








    getHistory(){


        return this.history;


    }





}



export default Feedback;