// visual/monitor.js


export class LearningMonitor {


    constructor(
        id
    ){


        this.el =
        document.getElementById(id);


        this.logs=[];


    }





    // =====================
    // 更新进度
    // =====================

    updateProgress(
        value
    ){


        if(
            !this.el
        ){

            return;

        }



        this.el.innerHTML =


        `

        <div class="panel">

        <div>
        AI学习进度
        </div>


        <div class="progress">

        <div class="progress-inner"

        style="width:${value}%">

        ${value}%

        </div>

        </div>


        </div>

        `;



    }





    // =====================
    // 添加日志
    // =====================

    addLog(
        text
    ){


        this.logs.push(
            text
        );



        if(
            this.logs.length>20
        ){

            this.logs.shift();

        }



        this.render();


    }





    // =====================
    // 渲染
    // =====================

    render(){


        if(
            !this.el
        ){

            return;

        }



        this.el.innerHTML +=


        `

        <div class="panel">

        ${

        this.logs
        .map(

        x=>

        `<div>${x}</div>`

        )
        .join("")

        }

        </div>

        `;



    }



}