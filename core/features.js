// core/features.js


export class FeatureEngine {


    constructor(){


        this.name =
        "feature_engine";


    }





    // =====================
    // 奇偶特征
    // =====================

    oddEven(
        numbers
    ){


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


        });



        return {


            odd,

            even,

            ratio:

            `${odd}:${even}`


        };


    }





    // =====================
    // 大小特征
    // =====================

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


        });



        return {


            big,

            small


        };


    }





    // =====================
    // 和值
    // =====================

    sum(
        numbers
    ){


        return numbers.reduce(
            (a,b)=>
            a+b,
            0
        );


    }





    // =====================
    // 跨度
    // =====================

    span(
        numbers
    ){


        let arr=[

            ...numbers

        ]
        .sort(
            (a,b)=>
            a-b
        );



        return (

            arr[arr.length-1]
            -
            arr[0]

        );


    }





    // =====================
    // 三区
    // =====================

    zones(
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



        return zone;


    }





    // =====================
    // 遗漏
    // =====================

    omission(
        history,
        number
    ){


        let count=0;



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



            count++;


        }



        return count;


    }





    // =====================
    // 单期特征
    // =====================

    build(
        item,
        history=[]
    ){


        return {


            front:
            item.front,


            back:
            item.back,



            oddEven:

            this.oddEven(
                item.front
            ),



            bigSmall:

            this.bigSmall(
                item.front
            ),



            sum:

            this.sum(
                item.front
            ),



            span:

            this.span(
                item.front
            ),



            zones:

            this.zones(
                item.front
            )


        };


    }





    // =====================
    // 批量转换
    // =====================

    transform(
        history
    ){


        return history.map(
            item=>

            this.build(
                item,
                history
            )

        );


    }



}