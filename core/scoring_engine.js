/**
 * DLT-AI-CORE VIP
 * Scoring Engine V2.0
 *
 * 综合评分系统
 */



class ScoringEngine {



    constructor(){


        this.weights={



            frequency:

            0.20,



            trend:

            0.15,



            omission:

            0.15,



            hotCold:

            0.15,



            structure:

            0.15,



            zone:

            0.10,



            random:

            0.10



        };


    }








    calculate(

        history=[]

    ){



        const frontScores={};



        for(

            let i=1;

            i<=35;

            i++

        ){



            frontScores[i]=

            this.numberScore(

                i,

                history

            );



        }






        return Object.keys(

            frontScores

        )

        .map(

            n=>({


                number:

                Number(n),


                score:

                Number(

                    frontScores[n]

                    .toFixed(3)

                )


            })

        )

        .sort(

            (a,b)=>

            b.score-a.score

        );



    }









    numberScore(

        number,

        history

    ){



        let frequency=

        this.frequencyScore(

            number,

            history

        );





        let trend=

        this.trendScore(

            number,

            history

        );





        let omission=

        this.omissionScore(

            number,

            history

        );





        let hotCold=

        this.hotColdScore(

            number,

            history

        );





        return (


            frequency

            *

            this.weights.frequency



            +

            trend

            *

            this.weights.trend



            +

            omission

            *

            this.weights.omission



            +

            hotCold

            *

            this.weights.hotCold



        );



    }









    // ======================
    // 出现频率
    // ======================


    frequencyScore(

        number,

        history

    ){



        let count=0;



        history.forEach(

            item=>{


                if(

                    item.front

                    .includes(number)

                ){

                    count++;

                }


            }

        );





        return count

        /

        history.length

        *

        100;



    }









    // ======================
    // 最近趋势
    // ======================


    trendScore(

        number,

        history

    ){



        const recent =

        history.slice(

            -100

        );





        let count=0;



        recent.forEach(

            item=>{


                if(

                    item.front

                    .includes(number)

                ){

                    count++;

                }


            }

        );






        return count;



    }









    // ======================
    // 遗漏周期
    // ======================


    omissionScore(

        number,

        history

    ){



        let miss=0;



        for(

            let i=

            history.length-1;

            i>=0;

            i--

        ){



            if(

                history[i]

                .front

                .includes(number)

            ){

                break;

            }


            miss++;



        }





        /*
        遗漏越接近周期
        分数越高
        */


        return Math.min(

            miss,

            50

        );



    }









    // ======================
    // 冷热评分
    // ======================


    hotColdScore(

        number,

        history

    ){



        const recent=

        history.slice(

            -30

        );



        let count=0;



        recent.forEach(

            item=>{


                if(

                    item.front

                    .includes(number)

                ){

                    count++;

                }


            }

        );





        return count;



    }








    // ======================
    // 结构评分
    // ======================


    structureScore(

        nums

    ){



        let score=0;



        const odd=

        nums.filter(

            n=>

            n%2

        )

        .length;





        if(

            odd>=2

            &&

            odd<=3

        ){

            score+=10;

        }






        const sum=

        nums.reduce(

            (a,b)=>

            a+b,

            0

        );





        if(

            sum>=90

            &&

            sum<=130

        ){

            score+=10;

        }





        return score;



    }







}



export default ScoringEngine;