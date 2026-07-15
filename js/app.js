// ==================================================
// 大乐透 AI V100 CORE FINAL
// app.js
// 系统总控制中心
// ==================================================

"use strict";


window.V100App = {



    lastResult:null,






    // ==========================
    // 系统启动
    // ==========================


    init(){



        console.log(
            "V100 AI CORE启动"
        );



        V100Database.init();



        V100Bayes.init();



        V100Learning.init();



        V100ModelVersion.init();




        this.updateStatus();




    },









    // ==========================
    // 更新系统状态
    // ==========================


    updateStatus(){



        let data =

        V100Database.report();




        let box =

        document.getElementById(
            "systemStatus"
        );



        if(box){



            box.innerHTML=


            `

            V100 AI CORE FINAL


            <br>


            历史数据：

            ${data.total}

            期


            <br>


            训练窗口：

            500期


            <br>


            模型版本：

            ${

            V100ModelVersion.currentVersion

            }


            `;



        }



    },









    // ==========================
    // 开始AI分析
    // ==========================


    async startAnalysis(){



        let status =

        document.getElementById(
            "analysisStatus"
        );



        if(status){


            status.innerHTML=

            "AI分析启动...";


        }





        let history =

        V100Database.get();





        if(
            history.length<500
        ){


            alert(
            "历史数据不足500期"
            );


            return;


        }







        let result =

        await V100Predictor.analyze(

            history

        );








        this.lastResult=result.final;





        // 保存最后预测


        localStorage.setItem(

            "V100_LAST_RESULT",

            JSON.stringify(
                result.final
            )

        );









        this.showResult(
            result
        );





    },









    // ==========================
    // 显示结果
    // ==========================


    showResult(result){



        let box=

        document.getElementById(
            "predictionResult"
        );



        if(!box){

            return;

        }







        box.innerHTML=


        `


        <h3>
        最终预测
        </h3>


        前区：

        ${

        result.final.front.join(" ")

        }


        <br>


        后区：

        ${

        result.final.back.join(" ")

        }


        <hr>


        TOP10


        <br>


        ${

        result.top10.map(

            (x,i)=>

            `

            第${i+1}组：

            ${x.front.join("-")}

            +

            ${x.back.join("-")}

            <br>

            `


        ).join("")

        }



        <hr>


        AI会议：


        <br>


        ${

        result.meeting.join("<br>")

        }


        `;



    },









    // ==========================
    // 开始历史训练
    // ==========================


    startTraining(){



        V100TrainingEngine.start();



    },








    // ==========================
    // 蒙特卡罗控制
    // ==========================


    stopMonte(){



        V100MonteCarlo.stop();



    },






    pauseMonte(){



        V100MonteCarlo.pauseRun();



    },






    continueMonte(){



        V100MonteCarlo.continueRun();



    }






};









document.addEventListener(

"DOMContentLoaded",

()=>{


    V100App.init();


});