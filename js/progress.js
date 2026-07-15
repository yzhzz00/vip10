// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// progress.js
// AI统一进度管理
// ==================================================

"use strict";


window.V100Progress = {



    total:0,


    current:0,


    title:"",





    // ==========================
    // 开始
    // ==========================


    start(

        title,

        total

    ){



        this.title = title;


        this.total = total;


        this.current = 0;



        this.render();



    },









    // ==========================
    // 更新
    // ==========================


    update(value){



        this.current=value;



        this.render();



    },









    // ==========================
    // 完成
    // ==========================


    finish(){



        this.current=

        this.total;



        this.render();



        setTimeout(()=>{


            let bar=

            document.getElementById(

                "progressContainer"

            );



            if(bar){


                bar.style.display=

                "none";


            }



        },1500);



    },









    // ==========================
    // 页面显示
    // ==========================


    render(){



        let box=

        document.getElementById(

            "progressContainer"

        );



        if(!box){

            return;

        }






        let percent=0;



        if(

            this.total>0

        ){


            percent=

            Math.floor(

                this.current

                /

                this.total

                *

                100

            );


        }






        box.style.display=

        "block";





        box.innerHTML=

        `


        <div class="progress-title">

        ${this.title}

        </div>



        <div class="progress-bar">


            <div

            class="progress-value"

            style="width:${percent}%">

            </div>


        </div>



        <div class="progress-text">


        ${percent}%


        (${this.current}/${this.total})


        </div>


        `;



    }




};