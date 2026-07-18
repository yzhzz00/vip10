// visual/dashboard.js


export class Dashboard {


    constructor(
        id
    ){


        this.el =
        document.getElementById(id);


    }





    // =====================
    // 渲染
    // =====================

    render(
        data
    ){


        if(
            !this.el
        ){

            return;

        }





        let models =

        data.models
        ||
        [];



        let weights =

        data.weights
        ||
        {};



        let results =

        data.results
        ||
        [];







        this.el.innerHTML =


        `


        <div class="panel">


        <h3>
        AI模型竞争状态
        </h3>



        ${
            models.map(
            m=>

            `

            <div>

            ${m.name}

            :

            运行中

            </div>

            `

            )
            .join("")
        }



        </div>





        <div class="panel">


        <h3>
        模型权重
        </h3>



        ${
            Object.keys(weights)

            .map(

            key=>

            `

            <div>

            ${key}

            :

            ${weights[key]}

            </div>


            `

            )

            .join("")

        }


        </div>






        <div class="panel">


        <h3>

        AI委员会 Top3

        </h3>




        ${

        results.map(

        (item,index)=>

        `


        <div class="result-item">


        第 ${index+1} 注


        <br>


        前区:

        ${

        item.candidate.front
        .join(" ")

        }


        <br>


        后区:

        ${

        item.candidate.back
        .join(" ")

        }


        <br>


        综合评分:

        ${

        item.score.toFixed
        ?
        item.score.toFixed(2)
        :
        item.score

        }


        </div>



        `

        )
        .join("")


        }



        </div>



        `;



    }



}