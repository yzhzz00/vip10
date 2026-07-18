function hitCount(prediction,result){


    let count=0;


    prediction.forEach(n=>{


        if(result.includes(n)){

            count++;

        }


    });


    return count;


}




function backtest(history,engine){


    const report=[];



    for(let i=100;i<history.length;i++){


        const train =

        history.slice(0,i);



        const real =

        history[i];



        const prediction =

        engine(train);



        report.push({


            period:i,


            hit:

            hitCount(
                prediction,
                real
            )


        });


    }



    return {


        total:
        report.length,


        detail:
        report


    };


}



export {

    backtest

};