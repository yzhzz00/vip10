// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// report.js
// AI智能报告中心
// ==================================================

"use strict";


window.V100Report = {



    // ==========================
    // 生成报告
    // ==========================


    generate(){


        return {

            system:
            this.system(),


            training:
            this.training(),


            model:
            this.model(),


            prediction:
            this.prediction()


        };


    },









    // ==========================
    // 系统信息
    // ==========================


    system(){



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
    // 训练报告
    // ==========================


    training(){



        let save =

        localStorage.getItem(

            "V100_TRAIN_REPORT"

        );





        if(
            !save
        ){


            return {


                total:0,


                front3:0,


                front2:0,


                front1:0,


                back2:0,


                back1:0



            };


        }






        return JSON.parse(
            save
        );



    },









    // ==========================
    // 模型权重
    // ==========================


    model(){



        if(
            !window.V100Learning
        ){

            return null;

        }




        return V100Learning.getWeights();



    },









    // ==========================
    // 最新预测
    // ==========================


    prediction(){



        let last=

        localStorage.getItem(

            "V100_LAST_RESULT"

        );





        if(
            !last
        ){

            return null;

        }




        let result=

        JSON.parse(
            last
        );







        let structure=null;



        if(
            window.V100Structure
        ){



            structure=

            V100Structure.check(

                result.front

            );


        }





        return {


            front:

            result.front,


            back:

            result.back,


            structure



        };



    },









    // ==========================
    // 页面显示
    // ==========================


    render(){



        let box=

        document.getElementById(

            "aiReport"

        );



        if(
            !box
        ){

            return;

        }






        let data=

        this.generate();








        let p=

        data.prediction;




        box.innerHTML=



        `

        <h3>

        V100.1 AI报告

        </h3>


        当前版本：

        ${data.system.version}


        <br>


        历史数据：

        ${data.system.history}

        期


        <br>


        训练窗口：

        ${data.system.window}

        期


        <hr>


        <h4>

        滚动考试

        </h4>


        总考试：

        ${data.training.total}


        次


        <br>


        前区≥3：

        ${data.training.front3}


        次


        <br>


        前区≥2：

        ${data.training.front2}


        次


        <br>


        后区2个：

        ${data.training.back2}


        次


        <hr>


        <h4>

        当前模型权重

        </h4>



        走势：

        ${data.model.trend}


        <br>


        结构：

        ${data.model.structure}


        <br>


        概率：

        ${data.model.probability}


        <br>


        Markov：

        ${data.model.markov}


        <br>


        后区：

        ${data.model.back}



        <hr>


        <h4>

        最新预测

        </h4>



        前区：

        ${
        p
        ?
        p.front.join(" ")

        :

        "暂无"

        }


        <br>


        后区：

        ${
        p
        ?
        p.back.join(" ")

        :

        "暂无"

        }



        <br>


        结构：

        ${
        p&&p.structure

        ?

        p.structure.zone.low

        +"-"+

        p.structure.zone.mid

        +"-"+

        p.structure.zone.high


        :

        ""

        }



        `;



    }




};