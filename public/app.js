// DLT-AI-CORE V11 FINAL
// public/app.js
// 前端交互


const statusBox =

document.getElementById(
    "status"
);



const resultBox =

document.getElementById(
    "result"
);



const loadingBox =

document.getElementById(
    "loading"
);



const progressBox =

document.getElementById(
    "progress"
);



const learningBox =

document.getElementById(
    "learning"
);



const backtestBox =

document.getElementById(
    "backtestResult"
);







// =====================
// 检测系统
// =====================


document

.getElementById("check")

.onclick = async()=>{


    try{


        const res =

        await fetch(
            "/api/status"
        );


        const data =

        await res.json();



        statusBox.innerHTML =


        `

        <p>
        系统状态:
        ${data.ready ? "运行中":"未启动"}
        </p>


        <p>
        历史数据:
        ${data.history} 期
        </p>


        <p>
        模型:
        ${data.models.join(",")}
        </p>

        `;



    }


    catch(error){


        statusBox.innerHTML =

        "连接失败";


    }


};








// =====================
// 开始预测
// =====================


document

.getElementById("predict")

.onclick = async()=>{


    try{


        loadingBox.innerHTML =

        "正在计算...";



        progressBox.innerHTML =

        "计算中";



        resultBox.innerHTML =

        "AI模型运行中...";





        const res =

        await fetch(

            "/api/predict",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:

                JSON.stringify({})

            }

        );



        const data =

        await res.json();





        if(data.error){


            throw new Error(
                data.error
            );


        }






        resultBox.innerHTML =


        `

        <h4>
        推荐号码
        </h4>


        <p>

        前区:

        <strong>

        ${data.front.join(" ")}

        </strong>

        </p>



        <p>

        后区:

        <strong>

        ${data.back.join(" ")}

        </strong>


        </p>



        <h4>
        模型状态
        </h4>


        <pre>

${JSON.stringify(
    data.models,
    null,
    2
)}

        </pre>

        `;



        loadingBox.innerHTML =

        "分析完成";


        progressBox.innerHTML =

        "100%";




    }


    catch(error){


        resultBox.innerHTML =

        "分析失败: "

        +

        error.message;



        loadingBox.innerHTML =

        "错误";


    }


};








// =====================
// 回测
// =====================


document

.getElementById("backtest")

.onclick = async()=>{


    backtestBox.innerHTML =

    "正在回测...";



    try{


        const res =

        await fetch(

            "/api/backtest"

        );



        const data =

        await res.json();




        backtestBox.innerHTML =


        `

        <pre>

${JSON.stringify(
    data,
    null,
    2
)}

        </pre>

        `;



    }


    catch(error){


        backtestBox.innerHTML =

        "回测失败";


    }



};








// =====================
// 学习状态
// =====================


async function loadLearning(){


    try{


        const res =

        await fetch(

            "/api/learning"

        );



        const data =

        await res.json();



        learningBox.innerHTML =


        `

        <p>
        学习次数:
        ${data.total}
        </p>


        <pre>

${JSON.stringify(
    data.performance,
    null,
    2
)}

        </pre>

        `;



    }


    catch(error){


        learningBox.innerHTML =

        "等待学习";


    }


}





loadLearning();