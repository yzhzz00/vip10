// models/markov.js


export class MarkovModel {


    constructor(){


        this.name =
        "markov";


        this.frontTransition={};


        this.backTransition={};


        this.last=null;


    }





    // =====================
    // 训练
    // =====================

    train(history){


        this.frontTransition={};


        this.backTransition={};



        for(
            let i=0;
            i<history.length-1;
            i++
        ){


            let current =
            history[i];


            let next =
            history[i+1];



            current.front.forEach(a=>{


                if(
                    !this.frontTransition[a]
                ){

                    this.frontTransition[a]={};

                }



                next.front.forEach(b=>{


                    if(
                        !this.frontTransition[a][b]
                    ){

                        this.frontTransition[a][b]=0;

                    }



                    this.frontTransition[a][b]++;


                });



            });





            current.back.forEach(a=>{


                if(
                    !this.backTransition[a]
                ){

                    this.backTransition[a]={};

                }



                next.back.forEach(b=>{


                    if(
                        !this.backTransition[a][b]
                    ){

                        this.backTransition[a][b]=0;

                    }



                    this.backTransition[a][b]++;


                });



            });



        }



        if(history.length){

            this.last =
            history[
                history.length-1
            ];

        }



    }





    // =====================
    // 转移评分
    // =====================

    transitionScore(
        current,
        next,
        map
    ){


        if(
            !map[current]
        ){

            return 0;

        }



        return (

            map[current][next]
            ||
            0

        );


    }





    // =====================
    // 候选评分
    // =====================

    predict(candidate){


        let score=0;



        if(
            !this.last
        ){

            return {

                model:this.name,

                score:0

            };

        }





        this.last.front.forEach(a=>{


            candidate.front.forEach(b=>{


                score +=

                this.transitionScore(

                    a,

                    b,

                    this.frontTransition

                );


            });


        });





        this.last.back.forEach(a=>{


            candidate.back.forEach(b=>{


                score +=

                this.transitionScore(

                    a,

                    b,

                    this.backTransition

                );


            });


        });





        return {


            model:
            this.name,


            score


        };


    }



}