function parsePL5(lines){


    const result=[];



    for(const line of lines){


        const nums =
        line.match(/\d/g);



        if(!nums || nums.length<5){

            continue;

        }



        result.push(

            nums
            .slice(0,5)
            .map(Number)

        );


    }



    return result;


}




function splitPosition(data){


    const position=[];



    for(let i=0;i<5;i++){


        position[i]=

        data.map(
            item=>item[i]
        );


    }



    return position;


}




export {


    parsePL5,

    splitPosition

};