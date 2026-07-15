// ==================================================
// 大乐透 AI V100 CORE FINAL
// trend.js
// 大乐透走势分析引擎
// ==================================================

"use strict";


window.V100Trend = {



    // ===============================
    // 主分析入口
    // ===============================


    analyze(history){


        if(
            !history ||
            history.length < 100
        ){

            return null;

        }



        return {


            zone:
            this.zoneAnalyze(history),



            oddEven:
            this.oddEvenAnalyze(history),



            bigSmall:
            this.bigSmallAnalyze(history),



            sum:
            this.sumAnalyze(history),



            repeat:
            this.repeatAnalyze(history),



            connect:
            this.connectAnalyze(history),



            missing:
            this.missingAnalyze(history),



            hotCold:
            this.hotCold(history)



        };


    },





    // ===============================
    // 分区分析
    // ===============================


    zoneAnalyze(history){



        let recent =
        history.slice(-500);



        let low=0;

        let middle=0;

        let high=0;



        recent.forEach(draw=>{


            draw.front.forEach(num=>{


                if(num<=12){

                    low++;

                }

                else if(num<=24){

                    middle++;

                }

                else{

                    high++;

                }



            });



        });




        let total =
        low+middle+high;



        return {


            low:
            Number(
            (low/total*5)
            .toFixed(2)
            ),



            middle:
            Number(
            (middle/total*5)
            .toFixed(2)
            ),



            high:
            Number(
            (high/total*5)
            .toFixed(2)
            )

        };



    },








    // ===============================
    // 奇偶走势
    // ===============================


    oddEvenAnalyze(history){



        let recent =
        history.slice(-100);



        let odd=0;

        let even=0;



        recent.forEach(d=>{


            d.front.forEach(n=>{


                if(n%2){

                    odd++;

                }
                else{

                    even++;

                }


            });


        });



        return {


            odd,

            even,


            suggest:

            odd>even

            ?

            "偏奇"

            :

            "偏偶"


        };

    },







    // ===============================
    // 大小走势
    // ===============================


    bigSmallAnalyze(history){



        let recent =
        history.slice(-100);



        let big=0;

        let small=0;



        recent.forEach(d=>{


            d.front.forEach(n=>{


                if(n>=18){

                    big++;

                }

                else{

                    small++;

                }


            });



        });



        return {


            big,

            small,


            suggest:


            big>small

            ?

            "偏大"

            :

            "偏小"



        };

    },








    // ===============================
    // 和值分析
    // ===============================


    sumAnalyze(history){



        let arr =
        history
        .slice(-100)
        .map(

            x=>

            x.front.reduce(
                (a,b)=>a+b,
                0
            )

        );




        let avg =

        arr.reduce(
            (a,b)=>a+b,
            0
        )

        /

        arr.length;




        return {


            average:

            Number(
            avg.toFixed(2)
            ),



            range:


            [

            Math.min(...arr),

            Math.max(...arr)

            ]



        };



    },








    // ===============================
    // 重号分析
    // ===============================


    repeatAnalyze(history){



        let last =

        history[
            history.length-1
        ];



        let before =

        history[
            history.length-2
        ];



        let count=0;



        last.front.forEach(n=>{


            if(
            before.front.includes(n)
            ){

                count++;

            }


        });



        return {


            lastRepeat:

            count,


            suggest:


            count<=1

            ?

            "防1-2个重号"

            :

            "降低重号"



        };



    },








    // ===============================
    // 连号分析
    // ===============================


    connectAnalyze(history){



        let recent =
        history.slice(-100);



        let count=0;



        recent.forEach(d=>{


            let nums =
            [...d.front]
            .sort(
                (a,b)=>a-b
            );



            for(
            let i=0;
            i<4;
            i++
            ){


                if(
                nums[i+1]-nums[i]===1
                ){

                    count++;

                }


            }



        });




        return {


            count,


            probability:

            Number(
            (count/100)
            .toFixed(2)
            )


        };


    },








    // ===============================
    // 遗漏分析
    // ===============================


    missingAnalyze(history){



        let miss={};



        for(
        let n=1;
        n<=35;
        n++
        ){


            miss[n]=0;



            for(
            let i=history.length-1;
            i>=0;
            i--
            ){


                if(
                history[i]
                .front
                .includes(n)
                ){

                    break;

                }



                miss[n]++;


            }


        }



        return miss;



    },








    // ===============================
    // 冷热分析
    // ===============================


    hotCold(history){



        let recent =
        history.slice(-100);



        let count={};



        for(
        let i=1;
        i<=35;
        i++
        ){

            count[i]=0;

        }




        recent.forEach(d=>{


            d.front.forEach(n=>{


                count[n]++;


            });



        });




        return count;



    }





};