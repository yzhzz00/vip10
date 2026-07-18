function parseDLT(lines){


    const result=[];


    for(const line of lines){


        const nums =
        line.match(/\d+/g);



        if(!nums || nums.length<7){

            continue;

        }



        const n =
        nums.map(Number);



        result.push({

            front:n.slice(0,5),

            back:n.slice(5,7)

        });


    }


    return result;


}



function splitArea(data){


    const front=[];

    const back=[];



    data.forEach(item=>{


        front.push(
            ...item.front
        );


        back.push(
            ...item.back
        );


    });



    return {

        front,

        back

    };


}



export {


    parseDLT,

    splitArea

};