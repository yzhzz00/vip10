class PredictionEngine {


    constructor(){


        this.result=[];


    }







    generate(modelResult){



        let scores=

        modelResult.scores;



        let numbers=Object.keys(scores)

        .map(n=>({


            number:Number(n),


            score:scores[n]


        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );





        let candidates=[];



        // 取高评分号码池

        let pool=

        numbers.slice(0,20)

        .map(x=>x.number);







        while(

            candidates.length<300

        ){



            let front=

            this.pickFront(

                pool

            );



            if(

                this.checkFront(front)

            ){



                candidates.push({


                    front,


                    score:

                    this.calcScore(

                        front,

                        scores

                    )


                });


            }



        }






        candidates.sort(

            (a,b)=>

            b.score-a.score

        );





        let result=[];



        for(

            let i=0;

            i<3;

            i++

        ){



            let item=

            candidates[i];



            result.push({


                front:item.front,


                back:this.generateBack(),


                score:

                Number(

                    item.score.toFixed(2)

                )


            });



        }





        this.result=result;



        return result;



    }








    pickFront(pool){



        let arr=[];



        while(

            arr.length<5

        ){



            let n=

            pool[

                Math.floor(

                    Math.random()*pool.length

                )

            ];



            if(

                !arr.includes(n)

            ){

                arr.push(n);

            }



        }



        return arr.sort(

            (a,b)=>a-b

        );

    }







    generateBack(){



        let arr=[];



        while(

            arr.length<2

        ){



            let n=

            Math.floor(

                Math.random()*12

            )+1;



            if(

                !arr.includes(n)

            )

            arr.push(n);



        }



        return arr.sort(

            (a,b)=>a-b

        );


    }









    checkFront(front){



        let odd=

        front.filter(

            n=>n%2!==0

        ).length;



        let sum=

        front.reduce(

            (a,b)=>a+b,

            0

        );



        // 奇偶

        if(

            odd<1 ||

            odd>4

        )

        return false;




        // 和值范围

        if(

            sum<60 ||

            sum>170

        )

        return false;




        // 不允许全同区

        return true;


    }







    calcScore(front,scores){



        let total=0;



        front.forEach(n=>{


            total+=

            scores[n]||0;


        });



        return total/5;



    }






    getResult(){


        return this.result;


    }



}



export default new PredictionEngine();