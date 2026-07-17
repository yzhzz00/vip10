// DLT-AI-CORE V11 FINAL
// core/theory.js
// 大乐透理论结构引擎


class TheoryEngine {


    constructor(){


        this.name =
        "theory";


    }









    analyze(draw){


        return {


            oddEven:
            this.oddEven(
                draw.front
            ),


            size:
            this.size(
                draw.front
            ),


            zone:
            this.zone(
                draw.front
            ),


            sum:
            this.sum(
                draw.front
            ),


            span:
            this.span(
                draw.front
            ),


            tail:
            this.tail(
                draw.front
            ),


            route012:
            this.route012(
                draw.front
            ),


            consecutive:
            this.consecutive(
                draw.front
            )


        };


    }









    oddEven(numbers){


        const odd =
        numbers.filter(
            n=>n%2!==0
        ).length;



        return {


            odd,


            even:
            numbers.length-odd



        };


    }









    size(numbers){


        const small =
        numbers.filter(
            n=>n<=17
        ).length;



        return {


            small,


            large:
            numbers.length-small



        };


    }









    zone(numbers){


        return {


            zone1:
            numbers.filter(
                n=>n>=1&&n<=12
            ).length,


            zone2:
            numbers.filter(
                n=>n>=13&&n<=24
            ).length,


            zone3:
            numbers.filter(
                n=>n>=25&&n<=35
            ).length


        };


    }









    sum(numbers){


        return numbers.reduce(
            (a,b)=>a+b,
            0
        );


    }









    span(numbers){


        return Math.max(
            ...numbers
        )
        -
        Math.min(
            ...numbers
        );


    }









    tail(numbers){


        return numbers.map(
            n=>n%10
        );


    }









    route012(numbers){


        return numbers.map(
            n=>n%3
        );


    }









    consecutive(numbers){


        let count = 0;



        for(
            let i=1;
            i<numbers.length;
            i++
        ){


            if(
                numbers[i]
                -
                numbers[i-1]
                ===1
            ){


                count++;


            }


        }



        return count;


    }



}



export default TheoryEngine;