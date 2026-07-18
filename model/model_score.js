import {

parseDLT

} from "../core/data.js";







function frequencyMap(){



    const history=

    parseDLT();



    const map={};



    history.forEach(item=>{


        item.front.forEach(num=>{


            map[num]=

            (map[num]||0)

            +

            1;


        });


    });





    return map;



}









function frequencyScore(numbers){



    const map=

    frequencyMap();



    let score=0;



    numbers.forEach(num=>{


        score +=

        map[num] || 0;



    });





    return score / numbers.length;



}









function sumScore(numbers){



    const sum=

    numbers.reduce(

        (a,b)=>a+b,

        0

    );



    if(

        sum>=80

        &&

        sum<=140

    ){

        return 100;

    }



    if(

        sum>=60

        &&

        sum<=160

    ){

        return 70;

    }



    return 40;



}









function oddEvenScore(numbers){



    const odd=

    numbers.filter(

        n=>n%2!==0

    ).length;



    if(

        odd===2

        ||

        odd===3

    ){

        return 100;

    }



    return 50;



}









function zoneScore(numbers){



    let one=0;

    let two=0;

    let three=0;



    numbers.forEach(n=>{


        if(n<=12){

            one++;

        }

        else if(n<=24){

            two++;

        }

        else{

            three++;

        }


    });






    let score=0;



    if(one>0){

        score+=30;

    }


    if(two>0){

        score+=40;

    }


    if(three>0){

        score+=30;

    }




    return score;



}









function consecutiveScore(numbers){



    let score=100;



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



            score-=20;


        }


    }




    return Math.max(

        score,

        0

    );



}









function repeatScore(numbers){



    const history=

    parseDLT();



    if(

        history.length===0

    ){

        return 50;

    }





    const last=

    history[0].front;



    let repeat=0;



    numbers.forEach(n=>{


        if(

            last.includes(n)

        ){

            repeat++;

        }


    });





    if(

        repeat===1

        ||

        repeat===2

    ){

        return 100;

    }



    return 60;



}









function scoreNumber(numbers){



    const score =


    frequencyScore(numbers)

    *

    0.25



    +



    sumScore(numbers)

    *

    0.20



    +



    oddEvenScore(numbers)

    *

    0.15



    +



    zoneScore(numbers)

    *

    0.15



    +



    consecutiveScore(numbers)

    *

    0.10



    +



    repeatScore(numbers)

    *

    0.15;








    return Number(

        score.toFixed(3)

    );



}








export {


    scoreNumber,


    frequencyScore,


    sumScore,


    oddEvenScore,


    zoneScore,


    consecutiveScore,


    repeatScore


};