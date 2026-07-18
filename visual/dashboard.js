// visual/dashboard.js


export class Dashboard {


    constructor(
        containerId
    ){


        this.container =
            document.getElementById(
                containerId
            );


    }



    // =========================
    // 渲染标题
    // =========================

    title(){


        return `

        <div class="dashboard-title">

        DLT-AI-CORE V11
        智能分析中心

        </div>

        `;


    }



    // =========================
    // 模型状态
    // =========================

    modelPanel(
        models
    ){


        let html =
        `

        <div class="panel">

        <h3>
        AI模型竞争状态
        </h3>

        `;



        models.forEach(
            m=>{


                html +=`

                <div>

                ${m.name}

                :

                ${m.score.toFixed(4)}

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
    // 权重显示
    // =========================

    weightPanel(
        weights
    ){


        let html=

        `

        <div class="panel">

        <h3>
        模型权重
        </h3>

        `;



        Object.entries(
            weights
        )
        .forEach(
            ([name,value])=>{


                html +=`

                <div>

                ${name}

                :

                ${value.toFixed(3)}

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
    // Top3结果
    // =========================

    resultPanel(
        results
    ){


        let html=

        `

        <div class="panel">

        <h3>
        最终预测 Top3
        </h3>

        `;



        results.forEach(
            (r,i)=>{


                html +=`

                <div>

                NO.${i+1}

                <br>


                前区:

                ${r.candidate.front.join(" ")}


                <br>


                后区:

                ${r.candidate.back.join(" ")}


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
    // 总渲染
    // =========================

    render(data){


        if(!this.container)
        return;



        this.container.innerHTML =

        this.title()

        +

        this.modelPanel(
            data.models
        )

        +

        this.weightPanel(
            data.weights
        )

        +

        this.resultPanel(
            data.results
        );


    }



}