function analyzeFront(front){



    const odd = front.filter(

        n=>n%2!==0

    ).length;



    const even = front.length - odd;



    const small = front.filter(

        n=>n<=17

    ).length;



    const big = front.length - small;




    const sum = front.reduce(

        (a,b)=>a+b,

        0

    );




    const span = Math.max(...front)

        -

        Math.min(...front);





    let consecutive = 0;



    for(

        let i=1;

        i<front.length;

        i++

    ){


        if(

            front[i]-front[i-1]===1

        ){

            consecutive++;

        }


    }





    return {


        odd,

        even,

        small,

        big,

        sum,

        span,

        consecutive


    };


}








function buildMatrix(history){



    return history.map(item=>{


        return {


            issue:item.issue,


            front:item.front,


            back:item.back,


            feature:analyzeFront(

                item.front

            )


        };


    });


}






module.exports={


    buildMatrix


};