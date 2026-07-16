// core/portraitBuilder.js

/*
    DLT-AI CORE

    Portrait Builder V1.0

    功能:
    历史开奖数据
        ↓
    开奖画像

*/


function buildPortrait(history){


    return history.map(item=>{


        const front = item.front;
        const back = item.back;



        // =====================
        // 前区和值
        // =====================

        const sum = front.reduce(
            (a,b)=>a+b,
            0
        );



        // =====================
        // 前区跨度
        // =====================

        const span =
            Math.max(...front)
            -
            Math.min(...front);



        // =====================
        // 奇偶
        // =====================

        let odd = 0;
        let even = 0;


        front.forEach(num=>{

            if(num % 2 === 0){

                even++;

            }else{

                odd++;

            }

        });



        // =====================
        // 大小
        // 1-17 小
        // 18-35 大
        // =====================

        let small = 0;
        let big = 0;


        front.forEach(num=>{

            if(num <=17){

                small++;

            }else{

                big++;

            }

        });



        // =====================
        // 三区
        // 01-12
        // 13-24
        // 25-35
        // =====================


        let zone1=0;
        let zone2=0;
        let zone3=0;


        front.forEach(num=>{


            if(num<=12){

                zone1++;

            }
            else if(num<=24){

                zone2++;

            }
            else{

                zone3++;

            }


        });



        // =====================
        // 后区画像
        // =====================


        const backSum =
            back.reduce(
                (a,b)=>a+b,
                0
            );


        const backOdd =
            back.filter(
                n=>n%2!==0
            ).length;


        const backEven =
            back.length-backOdd;



        // =====================
        // 返回画像
        // =====================


        return {


            issue:item.issue,

            date:item.date,


            front:item.front,

            back:item.back,


            portrait:{


                sum,


                span,


                oddEven:
                    `${odd}-${even}`,


                bigSmall:
                    `${big}-${small}`,


                zone:
                    `${zone1}-${zone2}-${zone3}`,


                backSum,


                backOddEven:
                    `${backOdd}-${backEven}`


            }


        };


    });


}



module.exports = buildPortrait;