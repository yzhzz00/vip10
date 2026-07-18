// models/markov.js


export class MarkovModel {


    constructor(){


        this.name =
            "markov";


        this.frontMatrix={};


        this.backMatrix={};


    }



    // =========================
    // 初始化转移矩阵
    // =========================

    init(){


        this.frontMatrix={};


        this.backMatrix={};



        for(
            let i=1;
            i<=35;
            i++
        ){


            this.frontMatrix[i]={};


        }



        for(
            let i=1;
            i<=12;
            i++
        ){


            this.backMatrix[i]={};


        }


    }



    // =========================
    // 训练转移关系
    // =========================

    train(history){


        this.init();



        for(
            let i=1;
            i<history.length;
            i++
        ){


            let prev =
                history[i-1];


            let curr =
                history[i];



            prev.front
            .forEach(a=>{


                curr.front
                .forEach(b=>{


                    this.addFront(
                        a,
                        b
                    );


                });


            });



            prev.back
            .forEach(a=>{


                curr.back
                .forEach(b=>{


                    this.addBack(
                        a,
                        b
                    );


                });


            });



        }



        this.normalize();



        return 1;


    }



    // =========================
    // 添加前区转移
    // =========================

    addFront(
        from,
        to
    ){


        if(
            !this.frontMatrix[from][to]
        ){

            this.frontMatrix[from][to]=0;

        }



        this.frontMatrix[from][to]++;


    }



    // =========================
    // 添加后区转移
    // =========================

    addBack(
        from,
        to
    ){


        if(
            !this.backMatrix[from][to]
        ){

            this.backMatrix[from][to]=0;

        }



        this.backMatrix[from][to]++;


    }



    // =========================
    // 概率化
    // =========================

    normalize(){



        for(
            let from in this.frontMatrix
        ){


            let total =
                Object.values(
                    this.frontMatrix[from]
                )
                .reduce(
                    (a,b)=>a+b,
                    0
                );



            for(
                let to in this.frontMatrix[from]
            ){


                this.frontMatrix[from][to]
                /=
                total;


            }


        }



        for(
            let from in this.backMatrix
        ){


            let total =
                Object.values(
                    this.backMatrix[from]
                )
                .reduce(
                    (a,b)=>a+b,
                    0
                );



            for(
                let to in this.backMatrix[from]
            ){


                this.backMatrix[from][to]
                /=
                total;


            }


        }


    }



    // =========================
    // 转移评分
    // =========================

    predict(candidate,last){


        let score=0;



        last.front
        .forEach(prev=>{


            candidate.front
            .forEach(next=>{


                score +=
                this.frontMatrix
                [prev]
                [next]
                ||
                0;


            });


        });



        last.back
        .forEach(prev=>{


            candidate.back
            .forEach(next=>{


                score +=
                this.backMatrix
                [prev]
                [next]
                ||
                0;


            });


        });



        return {


            model:
                this.name,


            score:
                score/7


        };


    }



}