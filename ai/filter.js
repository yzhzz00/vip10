function oddEvenCheck(numbers){


    const odd =

    numbers.filter(
        n=>n%2!==0
    ).length;


    const even =

    numbers.length-odd;



    return (

        odd>=1

        &&

        even>=1

    );


}




function zoneCheck(numbers){


    let a=0;

    let b=0;

    let c=0;



    numbers.forEach(n=>{


        if(n<=12){

            a++;

        }

        else if(n<=24){

            b++;

        }

        else{

            c++;

        }


    });



    return (

        a>=1

        &&

        b>=1

    );

}





function sumCheck(numbers){


    const sum =

    numbers.reduce(
        (a,b)=>a+b,
        0
    );


    return (

        sum>=50

        &&

        sum<=150

    );


}




function validCombination(numbers){


    return (

        oddEvenCheck(numbers)

        &&

        zoneCheck(numbers)

        &&

        sumCheck(numbers)

    );


}



export {

    validCombination

};