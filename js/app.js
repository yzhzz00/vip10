// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// app.js
// 系统总控制中心
// ==================================================

"use strict";


window.V100App = {



    // ==========================
    // 初始化
    // ==========================


    init(){



        console.log(
            "V100.1 AI CORE启动"
        );



        if(
            window.V100Learning
        ){

            V100Learning.init();

        }



        this.updateStatus();



    },









    // ==========================
    // 数据状态
    // ==========================


    updateStatus(){



        let box=

        document.getElementById(

            "systemStatus"

        );



        if(!box){

            return;

        }





        let total=0;



        if(
            window.V100Database
        ){

            total=

            V100Database.get().length;

        }





        box.innerHTML=

        `

        V100.1 AI CORE FINAL


        <br>


        历史数据：

        ${total}

        期


        <br>


        模型：

        已加载


        `;



    },









    // ==========================
    // 开始AI分析
    // ==========================


    async startAnalyze(){



        let history=

        V100Database.get();





        if(
            history.length<500
        ){


            alert(
            "历史数据不足500期"
            );


            return;


        }





        V100Progress.start(

            "AI综合分析",

            100

        );





        try{



            V100Progress.update(10);



            let result=

            await V100Predictor.analyze(

                history

            );





            V100Progress.update(100);






            this.showResult(

                result.final

            );







            V100Report.render();





        }

        catch(e){



            console.error(e);



            alert(

            "AI分析异常"

            );



        }




    },









    // ==========================
    // 开始历史训练
    // ==========================


    startTraining(){



        V100TrainingEngine.start();



    },









    // ==========================
    // 显示结果
    // ==========================


    showResult(result){



        let box=

        document.getElementById(

            "result"

        );



        if(!box){

            return;

        }





        box.innerHTML=

        `


        <h3>

        V100.1最终预测

        </h3>


        前区：

        ${

        result.front.join(" ")

        }


        <br>


        后区：

        ${

        result.back.join(" ")

        }


        <br>


        综合评分：

        ${

        result.score

        }



        `;



    }






};







// 页面启动

window.onload=function(){


    V100App.init();


};