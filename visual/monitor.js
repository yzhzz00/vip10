// visual/monitor.js


export class LearningMonitor {


    constructor(
        containerId
    ){


        this.container =
            document.getElementById(
                containerId
            );


        this.progress = 0;


        this.logs=[];


    }



    // =========================
    // 更新进度
    // =========================

    updateProgress(
        value
    ){


        this.progress =
            value;



        this.render();


    }



    // =========================
    // 添加学习日志
    // =========================

    addLog(
        message
    ){


        this.logs.unshift({

            time:
                new Date()
                .toLocaleTimeString(),


            message


        });



        if(
            this.logs.length>20
        ){


            this.logs.pop();


        }



        this.render();


    }



    // =========================
    // 模型学习状态
    // =========================

    modelStatus(
        models
    ){


        let html=
        `

        <div class="panel">

        <h3>
        历史滚动学习状态
        </h3>

        `;



        models.forEach(
            model=>{


                html +=`

                <div>

                ${model.name}

                学习完成

                <br>

                当前评分:

                ${
                    model.score
                    .toFixed(4)
                }


                </div>


                `;


            }
        );



        html+=`

        </div>

        `;



        return html;


    }



    // =========================
    // 进度条
    // =========================

    progressBar(){


        return `


        <div class="panel">


        <h3>

        AI学习进度

        </h3>


        <div class="progress">


        <div

        class="progress-inner"

        style="width:${this.progress}%"

        >

        ${this.progress}%


        </div>


        </div>


        </div>


        `;


    }



    // =========================
    // 学习日志
    // =========================

    logPanel(){


        let html=

        `

        <div class="panel">


        <h3>

        实时学习记录

        </h3>

        `;



        this.logs.forEach(
            log=>{


                html+=`

                <div>

                ${log.time}

                :

                ${log.message}

                </div>


                `;


            }
        );



        html+=`

        </div>

        `;



        return html;


    }



    // =========================
    // 渲染
    // =========================

    render(
        data={}
    ){


        if(!this.container)
        return;



        this.container.innerHTML =


            this.progressBar()

            +

            this.modelStatus(
                data.models || []
            )

            +

            this.logPanel();


    }



}