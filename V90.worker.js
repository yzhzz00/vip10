/*
================================================

大乐透AI_V90_Mobile

V90.worker.js

后台计算核心

================================================
*/


"use strict";




// ================================
// 随机生成前区
// ================================


function randomFront(){



    let nums=[];



    while(
        nums.length<5
    ){



        let n=

        Math.floor(
            Math.random()*35
        )+1;




        if(
            !nums.includes(n)
        ){

            nums.push(n);

        }



    }



    nums.sort(
        (a,b)=>
        a-b
    );



    return nums;



}









// ================================
// Monte Carlo后台模拟
// ================================


function monteCarlo(
    times
){



    let result={};



    for(
        let i=0;
        i<times;
        i++
    ){



        let front=

        randomFront();



        let key=

        front.join(",");




        result[key]=

        (
            result[key]||0
        )
        +1;






        if(
            i%5000===0
        ){



            postMessage({

                type:
                "progress",


                value:

                Math.floor(
                    i/times*100
                )


            });


        }



    }




    return result;



}









// ================================
// Worker入口
// ================================


self.onmessage=

function(e){



    let data=e.data;




    if(
        data.type==="MONTE_CARLO"
    ){



        let result=

        monteCarlo(

            data.times || 100000

        );





        postMessage({

            type:
            "complete",


            result


        });



    }



};