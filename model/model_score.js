function calculateScore(result){


    const hit =
    result.hit || 0;


    const total =
    result.total || 1;



    return Number(

        (
            hit /
            total *
            100

        ).toFixed(2)

    );


}



export {

    calculateScore

};