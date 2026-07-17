// DLT-AI-CORE VIP
// models/markov_model.js
//
// 一阶马尔可夫模型
//
// 分析:
// 上一期号码 -> 下一期号码
//

class MarkovModel {


    constructor(){


        this.front=[];


        this.back=[];


        this.frontMatrix={};


        this.backMatrix={};


    }








    train(history){



        this.frontMatrix={};

        this.backMatrix={};






        for(

            let i=0;

            i<history.length-1;

            i++

        ){



            let current=

            history[i];



            let next=

            history[i+1];







            current.front.forEach(a=>{



                if(

                    !this.frontMatrix[a]

                ){



                    this.frontMatrix[a]={};



                }







                next.front.forEach(b=>{



                    this.frontMatrix[a][b]=

                    (

                        this.frontMatrix[a][b]

                        ||

                        0

                    )

                    +

                    1;



                });



            });








            current.back.forEach(a=>{



                if(

                    !this.backMatrix[a]

                ){



                    this.backMatrix[a]={};



                }







                next.back.forEach(b=>{



                    this.backMatrix[a][b]=

                    (

                        this.backMatrix[a][b]

                        ||

                        0

                    )

                    +

                    1;



                });



            });



        }







        this.front=

        this.calculate(

            this.frontMatrix

        );







        this.back=

        this.calculate(

            this.backMatrix

        );







        return true;


    }









    calculate(matrix){



        let score={};







        Object.keys(matrix)

        .forEach(from=>{



            let target=

            matrix[from];







            Object.keys(target)

            .forEach(to=>{



                score[to]=

                (

                    score[to]

                    ||

                    0

                )

                +

                target[to];



            });



        });







        let max=

        Math.max(

            ...Object.values(score)

        );







        return Object.keys(score)

        .map(num=>({



            number:Number(num),



            score:

            Number(

                (

                score[num]

                /

                max

                *

                100

                )

                .toFixed(2)

            )



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );



    }









    analyze(){



        return {



            front:this.front,



            back:this.back



        };



    }



}





export default new MarkovModel();