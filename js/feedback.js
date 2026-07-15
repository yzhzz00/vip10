// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// feedback.js
// 开奖反馈学习模块
// ==================================================

"use strict";


window.V100Feedback = {



    // ==========================
    // 提交开奖
    // ==========================


    submit(){



        let period =

        document.getElementById(
            "feedbackPeriod"
        ).value;




        let frontText =

        document.getElementById(
            "feedbackFront"
        ).value;




        let backText =

        document.getElementById(
            "feedbackBack"
        ).value;







        let front =

        frontText

        .trim()

        .split(/\s+/)

        .map(Number);







        let back =

        backText

        .trim()

        .split(/\s+/)

        .map(Number);







        let result={



            period,


            date:

            new Date()
            .toISOString()
            .slice(0,10),



            front,


            back



        };






        // 保存开奖


        V100Database.add(

            result

        );








        // 分析上一期预测


        let last =

        localStorage.getItem(

            "V100_LAST_RESULT"

        );







        let compare=null;




        if(last){



            compare=

            this.compare(

                JSON.parse(last),

                result

            );




            this.learning(

                compare

            );



        }






        this.saveRecord(

            result,

            compare

        );







        alert(

        "开奖反馈完成，AI已学习"

        );




    },









    // ==========================
    // 比较预测
    // ==========================


    compare(

        predict,

        real

    ){



        let frontHit=

        predict.front.filter(

            n=>

            real.front.includes(n)

        );






        let backHit=

        predict.back.filter(

            n=>

            real.back.includes(n)

        );







        return {



            front:

            frontHit.length,



            back:

            backHit.length,



            frontNumbers:

            frontHit,



            backNumbers:

            backHit



        };



    },









    // ==========================
    // 学习
    // ==========================


    learning(compare){



        if(
            !window.V100Learning
        ){

            return;

        }





        let score=

        {


            result:

            {


                front:

                compare.front,


                back:

                compare.back


            }



        };






        V100Learning.learn(

            score

        );



    },









    // ==========================
    // 保存成长记录
    // ==========================


    saveRecord(

        real,

        compare

    ){



        let list=

        JSON.parse(

            localStorage.getItem(

                "V100_FEEDBACK_LOG"

            )

            ||

            "[]"

        );








        list.push({



            time:

            new Date()
            .toLocaleString(),



            real,



            compare



        });








        localStorage.setItem(

            "V100_FEEDBACK_LOG",

            JSON.stringify(
                list
            )

        );



    },









    // ==========================
    // 获取成长记录
    // ==========================


    getRecords(){



        return JSON.parse(

            localStorage.getItem(

                "V100_FEEDBACK_LOG"

            )

            ||

            "[]"

        );



    }



};