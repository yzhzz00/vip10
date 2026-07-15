// ==================================================
// 大乐透 AI V100 CORE FINAL
// training_ui.js
// AI滚动考试显示中心
// ==================================================

"use strict";


window.V100TrainingUI = {


    // ==========================
    // 更新界面
    // ==========================

    update(
        current,
        total,
        record
    ){



        let percent =
        Math.floor(
            current / total * 100
        );



        let progress =
        document.getElementById(
            "trainProgressBar"
        );



        let number =
        document.getElementById(
            "trainProgressNumber"
        );



        let status =
        document.getElementById(
            "trainStatus"
        );



        let detail =
        document.getElementById(
            "trainDetail"
        );



        if(progress){


            progress.style.width =
            percent+"%";


        }



        if(number){


            number.innerHTML =
            percent+"%";


        }



        if(status){


            status.innerHTML =

            `
            AI滚动考试：

            ${current}/${total}

            <br>

            当前窗口：

            500期

            `;


        }




        if(detail){



            detail.innerHTML =


            `

            <hr>


            <b>第 ${record.round} 次考试</b>


            <br><br>


            AI预测：

            <br>

            前区：

            ${record.predict.front.join(" ")}


            <br>

            后区：

            ${record.predict.back.join(" ")}



            <br><br>



            实际开奖：

            <br>

            前区：

            ${record.real.front.join(" ")}


            <br>

            后区：

            ${record.real.back.join(" ")}



            <br><br>



            命中：

            <br>


            前区：

            ${record.result.front}/5


            <br>


            后区：

            ${record.result.back}/2


            <br>


            总：

            ${record.result.total}/7


            `;



        }





        this.updateSummary();


    },





    // ==========================
    // 总成绩
    // ==========================


    updateSummary(){



        let box =
        document.getElementById(
            "trainSummary"
        );



        if(!box){

            return;

        }



        let records =
        V100TrainingEngine.records;



        if(
            records.length===0
        ){

            return;

        }




        let front=0;

        let back=0;



        records.forEach(

            r=>{


                front +=
                r.result.front;


                back +=
                r.result.back;


            }

        );




        box.innerHTML =


        `

        累计考试：

        ${records.length}轮


        <br>


        前区累计命中：

        ${front}


        <br>


        后区累计命中：

        ${back}



        <br>


        平均前区：

        ${(front/records.length).toFixed(2)}



        <br>


        平均后区：

        ${(back/records.length).toFixed(2)}

        `;



    }






};