class PredictionEngine {


    constructor(){


        this.result=[];


    }




    generate(){



        let result=[];



        for(let i=0;i<3;i++){



            let front=new Set();



            while(front.size<5){


                front.add(

                    Math.floor(

                        Math.random()*35

                    )+1

                );


            }




            let back=new Set();



            while(back.size<2){


                back.add(

                    Math.floor(

                        Math.random()*12

                    )+1

                );


            }





            result.push({


                front:

                [...front].sort(

                    (a,b)=>a-b

                ),



                back:

                [...back].sort(

                    (a,b)=>a-b

                ),



                score:

                Number(

                    (

                    Math.random()*30+70

                    )

                    .toFixed(2)

                )


            });



        }



        this.result=result;



        return result;


    }



}



export default new PredictionEngine();