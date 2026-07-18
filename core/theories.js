// core/theories.js


export class TheoryEngine {


    constructor(){


        this.name =
        "theory";


    }





    // =====================
    // 奇偶结构评分
    // =====================

    oddEvenScore(
        numbers
    ){


        let odd=0;


        numbers.forEach(
        n=>{


            if(
                n%2!==0
            ){

                odd++;

            }


        });



        let even =
        numbers.length-odd;



        let score=0;



        // 大乐透常见结构

        if(
            odd>=2
            &&
            odd<=3
        ){

            score+=1;

        }



        if(
            even>=2
            &&
            even<=3
        ){

            score+=1;

        }



        return score;


    }





    // =====================
    // 三区评分
    // =====================

    zoneScore(
        numbers
    ){


        let zone=[0,0,0];



        numbers.forEach(
        n=>{


            if(
                n<=12
            ){

                zone[0]++;

            }
            else if(
                n<=24
            ){

                zone[1]++;

            }
            else{

                zone[2]++;

            }


        });



        let active =
        zone.filter(
            x=>x>0
        )
        .length;



        return active>=2
        ?
        1
        :
        0;


    }





    // =====================
    // 和值评分
    // =====================

    sumScore(
        numbers
    ){


        let sum =

        numbers.reduce(
            (a,b)=>
            a+b,
            0
        );



        if(
            sum>=70
            &&
            sum<=130
        ){

            return 1;

        }



        return 0;


    }





    // =====================
    // 跨度评分
    // =====================

    spanScore(
        numbers
    ){


        let arr=[

            ...numbers

        ]
        .sort(
            (a,b)=>
            a-b
        );



        let span =

        arr[4]
        -
        arr[0];



        if(
            span>=15
            &&
            span<=32
        ){

            return 1;

        }



        return 0;


    }





    // =====================
    // 综合理论评分
    // =====================

    score(
        candidate
    ){


        let front =
        candidate.front;



        let score=0;



        score +=

        this.oddEvenScore(
            front
        );



        score +=

        this.zoneScore(
            front
        );



        score +=

        this.sumScore(
            front
        );



        score +=

        this.spanScore(
            front
        );





        return score;



    }



}