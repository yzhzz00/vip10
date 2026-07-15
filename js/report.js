// ==================================================
// 大乐透 AI V100 CORE FINAL
// report.js
// AI分析报告中心
// ==================================================

"use strict";


window.V100Report = {



    // ==========================
    // 生成总报告
    // ==========================

    generate(){



        return {



            system:

            this.systemReport(),



            model:

            this.modelReport(),



            training:

            this.trainingReport(),



            learning:

            this.learningReport()



        };


    },








    // ==========================
    // 系统状态
    // ==========================


    systemReport(){



        let data =

        V100Database.report();



        return {


            version:

            V100ModelVersion.currentVersion,



            history:

            data.total,



            window:

            500



        };



    },









    // ==========================
    // 模型报告
    // ==========================


    modelReport(){



        let weight =

        V100Learning.getWeights();





        return {



            trend:

            weight.trend,



            structure:

            weight.structure,



            probability:

            weight.probability,



            markov:

            weight.markov,



            back:

            weight.back



        };



    },









    // ==========================
    // 训练报告
    // ==========================


    trainingReport(){



        if(
            !V100Learning
        ){

            return null;

        }




        return V100Learning.report();



    },









    // ==========================
    // 学习报告
    // ==========================


    learningReport(){



        if(
            !V100Bayes
        ){

            return null;

        }




        return V100Bayes.report();



    },









    // ==========================
    // 显示报告
    // ==========================


    render(){



        let box=

        document.getElementById(
            "aiReport"
        );



        if(!box){

            return;

        }




        let data=

        this.generate();






        box.innerHTML=


        `

        <h3>
        V100 AI报告
        </h3>


        模型版本：

        ${data.system.version}


        <br>


        历史数据：

        ${data.system.history}期


        <br>


        训练次数：

        ${data.training.training}


        <br>


        命中次数：

        ${data.training.hit}


        <hr>


        权重：

        <br>


        走势：

        ${data.model.trend}


        <br>


        结构：

        ${data.model.structure}


        <br>


        概率：

        ${data.model.probability}


        <br>


        马尔可夫：

        ${data.model.markov}


        <br>


        后区：

        ${data.model.back}


        `;



    }





};