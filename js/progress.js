// ==================================================
// 大乐透 AI V100 CORE FINAL
// progress.js
// 全局进度管理
// ==================================================

"use strict";


window.V100Progress = {



    current:0,


    total:100,


    title:"等待任务",




    // ==========================
    // 开始任务
    // ==========================


    start(name,total){


        this.title=name;


        this.total=total;


        this.current=0;



        this.render();


    },







    // ==========================
    // 更新进度
    // ==========================


    update(value){



        this.current=value;



        this.render();



    },








    // ==========================
    // 增加进度
    // ==========================


    add(step=1){


        this.current+=step;


        if(
            this.current>this.total
        ){

            this.current=this.total;

        }


        this.render();


    },









    // ==========================
    // 完成
    // ==========================


    finish(){



        this.current=this.total;


        this.render();



    },








    // ==========================
    // 显示
    // ==========================


    render(){



        let percent =

        Math.floor(

            this.current
            /
            this.total
            *
            100

        );




        let bar=

        document.getElementById(
            "globalProgressBar"
        );



        let text=

        document.getElementById(
            "globalProgressText"
        );



        let name=

        document.getElementById(
            "globalProgressTitle"
        );





        if(bar){


            bar.style.width=

            percent+"%";


        }






        if(text){


            text.innerHTML=

            percent+"%";


        }





        if(name){


            name.innerHTML=

            this.title;



        }



    }






};