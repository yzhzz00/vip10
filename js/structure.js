// ==================================================
// 大乐透 AI V100 CORE FINAL
// structure.js
// 大乐透号码结构过滤引擎
// ==================================================

"use strict";


window.V100Structure = {



    // =================================
    // 主过滤
    // =================================


    check(front,trend){


        let result={

            pass:true,

            score:100,

            reason:[]

        };



        // 分区

        let zone =
        this.zone(front);



        if(
            !this.zoneCheck(zone,trend)
        ){

            result.pass=false;

            result.reason.push(
                "分区异常"
            );

        }





        // 奇偶

        let oddEven =
        this.oddEven(front);



        if(
            !this.oddEvenCheck(oddEven)
        ){

            result.score-=10;

            result.reason.push(
                "奇偶偏离"
            );

        }






        // 大小

        let bigSmall =
        this.bigSmall(front);



        if(
            !this.bigSmallCheck(bigSmall)
        ){

            result.score-=10;

            result.reason.push(
                "大小异常"
            );

        }






        // 和值

        let sum =
        this.sum(front);



        if(
            sum<80 ||
            sum>150
        ){

            result.pass=false;

            result.reason.push(
                "和值异常"
            );

        }







        // 连号

        let connect =
        this.connect(front);



        if(connect>2){

            result.score-=15;

            result.reason.push(
                "连号过多"
            );

        }





        return result;



    },







    // =================================
    // 分区
    // =================================


    zone(front){


        let low=0;

        let mid=0;

        let high=0;



        front.forEach(n=>{


            if(n<=12)

                low++;


            else if(n<=24)

                mid++;


            else

                high++;



        });



        return {


            low,

            mid,

            high


        };


    },





    zoneCheck(zone,trend){



        /*
        
        推荐结构：

        2低2中1高

        或

        1低2中2高
        
        */


        if(
            zone.low>=1 &&
            zone.low<=3 &&
            zone.mid>=1 &&
            zone.high>=1
        ){

            return true;

        }



        return false;



    },








    // =================================
    // 奇偶
    // =================================


    oddEven(front){



        let odd=0;

        let even=0;



        front.forEach(n=>{


            if(n%2)

                odd++;

            else

                even++;



        });



        return {

            odd,

            even

        };


    },





    oddEvenCheck(data){



        return (

            data.odd>=1 &&

            data.even>=1

        );


    },








    // =================================
    // 大小
    // =================================


    bigSmall(front){



        let big=0;

        let small=0;



        front.forEach(n=>{


            if(n>=18)

                big++;

            else

                small++;



        });



        return {

            big,

            small

        };


    },





    bigSmallCheck(data){



        return (

            data.big>=1 &&

            data.small>=1

        );


    },








    // =================================
    // 和值
    // =================================


    sum(front){



        return front.reduce(

            (a,b)=>a+b,

            0

        );


    },








    // =================================
    // 连号
    // =================================


    connect(front){



        let nums=

        [...front]
        .sort(
            (a,b)=>a-b
        );



        let count=0;



        for(
            let i=0;
            i<4;
            i++
        ){


            if(
                nums[i+1]-nums[i]
                ===1
            ){

                count++;

            }


        }



        return count;



    }






};