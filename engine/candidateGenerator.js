// engine/candidateGenerator.js


/*
    DLT-AI CORE

    Candidate Generator V1.0


    输入:

    Portrait预测


    输出:

    候选号码池


*/


function randomInt(min,max){

    return Math.floor(
        Math.random()
        *
        (max-min+1)
    )
    +
    min;

}



// 生成组合

function combination(arr,size){


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




// 前区生成

function generateFront(){


    const numbers=[];


    for(
        let i=1;
        i<=35;
        i++
    ){

        numbers.push(i);

    }



    return combination(
        numbers,
        5
    );

}



// 后区生成

function generateBack(){


    const numbers=[];


    for(
        let i=1;
        i<=12;
        i++
    ){

        numbers.push(i);

    }



    return combination(
        numbers,
        2
    );

}




// 计算和值

function sum(arr){

    return arr.reduce(
        (a,b)=>a+b,
        0
    );

}




// 三区

function zone(front){


    let a=0;
    let b=0;
    let c=0;


    front.forEach(n=>{


        if(n<=12)
            a++;

        else if(n<=24)
            b++;

        else
            c++;


    });


    return `${a}-${b}-${c}`;

}





function generateCandidates(
    portrait,
    limit=5000
){


    const fronts =
    generateFront();


    const backs =
    generateBack();



    const result=[];



    fronts.forEach(front=>{


        // 和值过滤

        const s =
        sum(front);



        if(
            s <
            portrait.sum.range.min
            ||
            s >
            portrait.sum.range.max
        ){

            return;

        }



        // 三区过滤

        if(
            zone(front)
            !==
            portrait.zone.value
        ){

            return;

        }



        backs.forEach(back=>{


            result.push({

                front,

                back,


                sum:s,


                zone:
                zone(front)

            });



        });



    });



    // 随机打乱

    result.sort(
        ()=>Math.random()-0.5
    );



    return result.slice(
        0,
        limit
    );

}



module.exports =
generateCandidates;