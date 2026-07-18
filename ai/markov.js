function buildMarkov(numbers){


    const matrix={};



    for(let i=0;i<numbers.length-1;i++){


        const current=
        numbers[i];


        const next=
        numbers[i+1];



        if(!matrix[current]){

            matrix[current]={};

        }



        matrix[current][next]=

        (matrix[current][next]||0)+1;



    }



    return matrix;


}



function transitionScore(matrix,current){


    const row=

    matrix[current]||{};



    const total=

    Object.values(row)

    .reduce(

        (a,b)=>a+b,

        0

    );



    const result={};



    Object.keys(row)

    .forEach(n=>{


        result[n]=

        row[n]/total;


    });



    return result;


}



export {


    buildMarkov,

    transitionScore

};