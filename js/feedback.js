// ==================================================
// 大乐透 AI V100 CORE FINAL
// feedback.js
// 开奖反馈学习模块
// ==================================================

"use strict";


window.V100Feedback = {



    // ==========================
    // 获取输入开奖
    // ==========================


    getInput(){


        let front=[];


        let back=[];



        for(
            let i=1;
            i<=5;
            i++
        ){


            let value =

            document.getElementById(

                "front"+i

            ).value;



            if(value){

                front.push(
                    Number(value)
                );

            }


        }






        for(
            let i=1;
            i<=2;
            i++
        ){


            let value =

            document.getElementById(

                "back"+i

            ).value;




            if(value){

                back.push(
                    Number(value)
                );


            }


        }







        return {


            front:

            front.sort(
                (a,b)=>a-b
            ),



            back:

            back.sort(
                (a,b)=>a-b
            )



        };



    },








    // ==========================
    // 保存开奖
    // ==========================


    save(){



        let result =

        this.getInput();





        if(
            result.front.length!==5
            ||
            result.back.length!==2
        ){


            alert(
            "请输入完整开奖"
            );


            return;


        }







        let history =

        JSON.parse(

        localStorage.getItem(
            "DLT_HISTORY"
        )

        ||

        "[]"

        );






        history.push({

            front:
            result.front,


            back:
            result.back,


            time:
            Date.now()


        });







        localStorage.setItem(

            "DLT_HISTORY",

            JSON.stringify(
                history
            )

        );







        this.learn(result);





        alert(
            "开奖保存完成，AI已复盘"
        );



    },









    // ==========================
    // 复盘学习
    // ==========================


    learn(real){



        let lastPredict =

        JSON.parse(

        localStorage.getItem(
            "V100_LAST_RESULT"
        )

        );






        if(
            !lastPredict
        ){

            return;

        }






        let frontHit =

        lastPredict.front.filter(

            n=>

            real.front.includes(n)

        );






        let backHit =

        lastPredict.back.filter(

            n=>

            real.back.includes(n)

        );








        let record={


            predict:
            lastPredict,



            real,



            result:{


                front:
                frontHit.length,


                back:
                backHit.length,


                total:

                frontHit.length+
                backHit.length


            },



            time:
            Date.now()



        };








        let logs =

        JSON.parse(

        localStorage.getItem(
            "V100_FEEDBACK_LOG"
        )

        ||

        "[]"

        );






        logs.push(record);






        localStorage.setItem(

            "V100_FEEDBACK_LOG",

            JSON.stringify(
                logs
            )

        );







        // 调用贝叶斯学习


        if(
            window.V100Bayes
        ){


            V100Bayes.learn(
                record
            );


        }





    }





};