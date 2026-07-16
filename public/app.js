// ======================================================
// DLT-AI-CORE V10.2
// Frontend Controller
// 手机端优化
// ======================================================



const statusText =
document.getElementById(
    "status"
);


const historyText =
document.getElementById(
    "history"
);


const startBtn =
document.getElementById(
    "startBtn"
);


const progressBar =
document.getElementById(
    "progressBar"
);


const progressText =
document.getElementById(
    "progressText"
);


const resultBox =
document.getElementById(
    "result"
);


const committeeBox =
document.getElementById(
    "committee"
);


const explainBox =
document.getElementById(
    "explain"
);






// ======================================================
// 加载系统状态
// ======================================================


async function loadStatus(){


    try{


        let response =
        await fetch(
            "/api/status"
        );



        let data =
        await response.json();




        statusText.innerText =
        data.status;



        historyText.innerText =
        data.history;



    }

    catch(error){


        statusText.innerText =
        "连接失败";


    }


}




loadStatus();







// ======================================================
// 进度控制
// 防止手机误认为卡死
// ======================================================



function startProgress(){



    let value=0;



    progressBar.style.width =
    "0%";



    progressBar.innerText =
    "0%";



    progressText.innerText =
    "AI模型计算中...";




    let timer =
    setInterval(()=>{


        if(
            value<90
        ){


            value++;



            progressBar.style.width =
            value+"%";



            progressBar.innerText =
            value+"%";


        }



    },300);




    return timer;


}







function finishProgress(timer){



    clearInterval(timer);



    progressBar.style.width =
    "100%";



    progressBar.innerText =
    "100%";



    progressText.innerText =
    "分析完成";


}








// ======================================================
// 开始分析
// ======================================================



startBtn.onclick =
async function(){



    startBtn.disabled =
    true;



    resultBox.innerHTML =
    "正在启动模型...";



    committeeBox.innerHTML =
    "模型竞技场运行中...";



    let timer =
    startProgress();






    try{



        let response =
        await fetch(
            "/api/analyze"
        );



        let data =
        await response.json();




        finishProgress(timer);






        resultBox.innerHTML =

        `

        <div class="number">

        前区:

        <strong>
        ${data.front.join(" ")}
        </strong>


        </div>



        <div class="number">

        后区:

        <strong>
        ${data.back.join(" ")}
        </strong>


        </div>


        `;







        committeeBox.innerHTML =

        `

        <p>
        ✔ Frequency模型
        </p>

        <p>
        ✔ Trend模型
        </p>

        <p>
        ✔ Cycle模型
        </p>

        <p>
        ✔ Bayes模型
        </p>

        <p>
        ✔ Markov模型
        </p>

        <p>
        ✔ Monte Carlo约束模拟
        </p>

        <p>
        ✔ AI委员会融合
        </p>

        `;







        explainBox.innerHTML =

        `

        <p>
        系统版本:
        DLT-AI-CORE V10.2
        </p>


        <p>
        核心:
        多模型竞争 + 动态权重
        </p>


        <p>
        学习:
        滚动反馈进化
        </p>


        <p>
        修正:
        Anti Human Bias
        </p>


        `;




    }

    catch(error){



        finishProgress(timer);



        resultBox.innerHTML =
        "分析失败，请检查服务器";



        console.log(error);



    }





    startBtn.disabled =
    false;



};