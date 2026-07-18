// core/theories.js


export class TheoryEngine {


    constructor(){


        this.name =
            "dlt_theory";


    }



    // =========================
    // 奇偶分析
    // =========================

    oddEven(numbers){


        let odd=0;

        let even=0;



        numbers.forEach(
            n=>{


                if(
                    n%2===0
                ){

                    even++;

                }
                else{

                    odd++;

                }


            }
        );



        return {


            odd,

            even,


            ratio:
            odd+"/"+even


        };


    }





    // =========================
    // 大小分析
    // 前区 1-35
    // =========================

    bigSmall(
        numbers
    ){


        let big=0;

        let small=0;



        numbers.forEach(
            n=>{


                if(
                    n>=18
                ){

                    big++;

                }
                else{

                    small++;

                }


            }
        );



        return {


            big,

            small


        };


    }





    // =========================
    // 和值
    // =========================

    sum(
        numbers
    ){


        return numbers
        .reduce(
            (a,b)=>
            a+b,
            0
        );


    }





    // =========================
    // 跨度
    // =========================

    span(
        numbers
    ){


        let sort =
            [
                ...numbers
            ]
            .sort(
                (a,b)=>
                a-b
            );



        return (

            sort[
                sort.length-1
            ]
            -
            sort[0]

        );


    }





    // =========================
    // 三区分析
    // 前区:
    // 1-12
    // 13-24
    // 25-35
    // =========================

    zones(
        numbers
    ){


        let zone1=0;

        let zone2=0;

        let zone3=0;



        numbers.forEach(
            n=>{


                if(
                    n<=12
                ){

                    zone1++;

                }
                else if(
                    n<=24
                ){

                    zone2++;

                }
                else{

                    zone3++;

                }


            }
        );



        return {


            zone1,

            zone2,

            zone3


        };


    }





    // =========================
    // 后区大小
    // =========================

    backZone(
        numbers
    ){


        return this.bigSmall(
            numbers
        );


    }





    // =========================
    // 综合理论评分
    // =========================

    score(
        candidate
    ){


        let front =
            candidate.front;



        let score=0;



        let odd =
            this.oddEven(
                front
            );



        let zone =
            this.zones(
                front
            );



        let sum =
            this.sum(
                front
            );



        /*
          理论评分

          不预测结果

          只评价结构合理性
        */



        // 奇偶偏向

        if(
            odd.odd>=2 &&
            odd.odd<=3
        ){

            score+=0.25;

        }



        // 三区分布

        let zones =
            [
                zone.zone1,
                zone.zone2,
                zone.zone3
            ];



        if(
            zones.filter(
                x=>x>0
            ).length>=2
        ){

            score+=0.25;

        }



        // 和值范围

        if(
            sum>=70 &&
            sum<=130
        ){

            score+=0.25;

        }



        // 跨度

        let span =
            this.span(
                front
            );



        if(
            span>=15 &&
            span<=32
        ){

            score+=0.25;

        }



        return score;


    }



}