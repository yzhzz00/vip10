// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// structure.js
// 大乐透号码结构分析模块
// ==================================================

"use strict";


window.V100Structure = {



    // ==========================
    // 主检查
    // ==========================


    check(front){



        let score=100;


        let reasons=[];




        // 排序

        front=

        front.sort(
            (a,b)=>a-b
        );






        // 三区

        let zone=

        this.zone(front);



        if(
            !this.checkZone(zone)
        ){


            score-=20;


            reasons.push(
            "三区比例异常"
            );


        }







        // 奇偶


        let odd=

        front.filter(

            n=>

            n%2===1

        ).length;




        if(
            odd<1
            ||
            odd>4
        ){


            score-=15;


            reasons.push(
            "奇偶比例异常"
            );


        }








        // 和值


        let sum=

        front.reduce(

            (a,b)=>

            a+b,

            0

        );




        if(
            sum<80
            ||
            sum>140
        ){


            score-=20;


            reasons.push(
            "和值异常"
            );


        }








        // 跨度


        let span=

        front[4]

        -

        front[0];





        if(
            span<15
            ||
            span>34
        ){


            score-=10;


            reasons.push(
            "跨度异常"
            );


        }









        // 连号


        let consecutive=

        this.hasConsecutive(
            front
        );



        if(
            consecutive>2
        ){


            score-=10;


            reasons.push(
            "连号过多"
            );


        }







        // 分数保护


        if(
            score<0
        ){

            score=0;

        }




        return {


            pass:

            score>=60,



            score,



            zone,



            sum,



            odd,



            span,



            reasons



        };



    },









    // ==========================
    // 三区计算
    // ==========================


    zone(front){



        let low=0;

        let mid=0;

        let high=0;




        front.forEach(n=>{


            if(
                n<=12
            ){

                low++;

            }
            else if(
                n<=24
            ){

                mid++;

            }
            else{

                high++;

            }



        });





        return {


            low,

            mid,

            high


        };



    },









    // ==========================
    // 三区合理性
    // ==========================


    checkZone(zone){



        let key=

        zone.low

        +

        "-"

        +

        zone.mid

        +

        "-"

        +

        zone.high;





        let allow=[


            "2-2-1",

            "2-1-2",

            "1-2-2",

            "1-3-1",

            "3-1-1"


        ];





        return allow.includes(
            key
        );


    },









    // ==========================
    // 连号数量
    // ==========================


    hasConsecutive(front){



        let count=0;



        for(
            let i=1;

            i<front.length;

            i++

        ){



            if(

            front[i]

            -

            front[i-1]

            ===1

            ){


                count++;


            }


        }




        return count;



    }







};