function frequency(numbers){

    const map={};


    for(let i=1;i<=35;i++){

        map[i]=0;

    }


    numbers.forEach(n=>{

        map[n]++;

    });


    return map;

}



function omission(numbers,total=35){


    const result={};


    for(let i=1;i<=total;i++){

        result[i]=null;

    }



    for(let i=numbers.length-1;i>=0;i--){


        const n=numbers[i];


        if(result[n]===null){

            result[n]=numbers.length-1-i;

        }


    }



    return result;


}



function oddEven(numbers){


    let odd=0;

    let even=0;


    numbers.forEach(n=>{


        if(n%2===0){

            even++;

        }else{

            odd++;

        }


    });



    return {

        odd,

        even

    };


}



function rangeZone(numbers){


    let low=0;

    let mid=0;

    let high=0;



    numbers.forEach(n=>{


        if(n<=12){

            low++;

        }

        else if(n<=24){

            mid++;

        }

        else{

            high++;

        }


    });



    return {

        low,

        mid,

        high

    };


}



export {


    frequency,

    omission,

    oddEven,

    rangeZone

};