window.V110_ENGINE = {



    history:[],



    // ======================
    // 初始化
    // ======================

    async init(){


        console.log(
            "V110 AI CORE START"
        );



        await this.loadData();



        this.showDataCount();



    },









    // ======================
    // 加载历史数据
    // ======================

    async loadData(){



        try{


            let response =

            await fetch(
                V110_CONFIG.dataFile
            );



            let text =

            await response.text();





            this.history =

            V110_PARSER.parse(
                text
            );





            console.log(

                "历史数据:",

                this.history.length

            );





        }catch(e){



            console.log(

                "数据读取失败",

                e

            );



        }




    },









    // ======================
    // AI分析
    // ======================

    async analyze(){



        if(
            this.history.length===0
        ){


            alert(
                "没有历史数据"
            );


            return;


        }





        let result =

        await V110_PREDICTOR.predict(

            this.history

        );





        this.showResult(
            result
        );



    },









    // ======================
    // 历史训练
    // ======================

    async train(){



        let result =

        await V110_LEARNING.train(

            this.history

        );





        let report =

        V110_LEARNING.report();





        let box =

        document.getElementById(
            "reportBox"
        );



        if(box){



            box.innerHTML=


            `

            训练次数：

            ${report.total}

            <br>


            前区3个以上命中：

            ${report.hit}


            <br>


            命中率：

            ${report.rate}%


            `;


        }



    },









    // ======================
    // 显示数据期数
    // ======================

    showDataCount(){



        let el =

        document.getElementById(
            "dataCount"
        );



        if(el){



            el.innerHTML =

            this.history.length;



        }



    },









    // ======================
    // 显示预测结果
    // ======================

    showResult(result){



        let box =

        document.getElementById(
            "resultBox"
        );



        if(!box){

            return;

        }






        let html =

        `

        <h3>

        最优预测

        </h3>


        前区：

        ${

        result.best.front.join(" ")

        }


        <br>


        后区：

        ${

        result.best.back.join(" ")

        }


        <hr>


        TOP10

        <br>


        `;






        result.top10.forEach(

            (item,index)=>{


                html +=


                `

                ${index+1}：

                ${item.front.join(" ")}

                +

                ${item.back.join(" ")}

                <br>

                `;


            }

        );





        box.innerHTML=html;



    }






};