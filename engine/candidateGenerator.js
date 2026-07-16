// engine/candidateGenerator.js


/*
    DLT-AI CORE V1.0

    Candidate Generator

    功能:

    根据预测画像

    生成候选号码


*/



// 组合生成

function combination(
    arr,
    size
){


    const result=[];



    function backtrack(
        start,
        path
    ){


        if(
            path.length===size
        ){

            result.push(
                [...path]
            );

            return;

        }



        for(
            let i=start;
            i<arr.length;
            i++
        ){


            path.push(
                arr[i]
            );



            backtrack(
                i+1,
                path
            );



            path.pop();


        }


    }



    backtrack(
        0,
        []
    );



    return result;


}







function getSum(arr){


    return arr.reduce(
        (a,b)=>a+b,
        0
    );


}







function getZone(front){


    let a=0;

    let b=0;

    let c=0;



    front.forEach(num=>{


        if(num<=12){

            a++;

        }
        else if(num<=24){

            b++;

        }
        else{

            c++;

        }


    });



    return `${a}-${b}-${c}`;

}









function generateFrontCandidates(
    prediction
){


    const nums=[];



    for(
        let i=1;
        i<=35;
        i++
    ){

        nums.push(i);

    }




    const all =
    combination(
        nums,
        5
    );



    return all.filter(
        front=>{


            const sum =
            getSum(front);



            const zone =
            getZone(front);





            // 和值过滤

            if(
                sum
                <
                prediction.sum.min
                ||
                sum
                >
                prediction.sum.max
            ){

                return false;

            }




            // 三区过滤

            if(
                zone
                !==
                prediction.zone
            ){

                return false;

            }



            return true;


        }
    );


}









function generateBackCandidates(){


    const nums=[];



    for(
        let i=1;
        i<=12;
        i++
    ){

        nums.push(i);

    }



    return combination(
        nums,
        2
    );


}








function generateCandidates(
    prediction,
    limit=5000
){



    const fronts =

    generateFrontCandidates(
        prediction
    );



    const backs =

    generateBackCandidates();





    const result=[];





    fronts.forEach(
        front=>{


            backs.forEach(
                back=>{


                    result.push({

                        front,

                        back,


                        sum:
                        getSum(front),


                        zone:
                        getZone(front)


                    });


                }
            );


        }
    );






    // 防止过多

    return result
    .slice(
        0,
        limit
    );


}







module.exports =
generateCandidates;