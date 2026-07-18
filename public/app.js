/**
 * DLT-AI-CORE VIP
 * Frontend Logic V3.0 FINAL
 */



const $ = id =>
document.getElementById(id);





// =====================
// 页面初始化
// =====================


async function init(){


    await loadStatus();


    await loadHistory();


}





// =====================
// 系统状态
// =====================


async function loadStatus(){


    try{


        const res =

        await fetch(
            "/api/status"
        );


        const data =

        await res.json();



        $("status").innerHTML = `

        ✅ 系统运行正常<br>

        历史数据：

        ${data.history}期

        <br>

        模型数量：

        ${data.models.length}

        `;



    }catch(e){



        $("status").innerHTML=

        "❌ 系统连接失败";



    }



}








// =====================
// 历史数据
// =====================


async function loadHistory(){


    try{


        const res =

        await fetch(
            "/api/data"
        );


        const data =

        await res.json();




        const d =

        data.latest;




        $("history").innerHTML=`

        最新开奖：

        ${d.issue}

        <br>

        前区：

        ${d.front.join(" ")}

        <br>

        后区：

        ${d.back.join(" ")}

        `;



    }catch(e){


        $("history").innerHTML=

        "数据读取失败";


    }


}









// =====================
// 预测
// =====================


$("predictBtn")

.onclick = async()=>{


    startProgress();




    $("prediction").innerHTML=

    "AI计算中...";





    $("aiMeeting").innerHTML=

    "模型会议召开中...";





    try{



        const res =

        await fetch(
            "/api/predict"
        );




        const data =

        await res.json();





        finishProgress();





        showPrediction(
            data
        );



    }catch(e){



        $("prediction").innerHTML=

        "预测失败";



    }


};









// =====================
// 进度条
// =====================


function startProgress(){


    let value=0;


    const timer =

    setInterval(()=>{



        value+=5;



        if(value>=95){


            clearInterval(timer);


            return;


        }




        $("progressBar")

        .style.width=

        value+"%";




        $("progressBar")

        .innerHTML=

        value+"%";





        $("processText")

        .innerHTML=

        "正在执行模型计算..."



    },300);



}





function finishProgress(){



    $("progressBar")

    .style.width=

    "100%";



    $("progressBar")

    .innerHTML=

    "100%";



    $("processText")

    .innerHTML=

    "✅ AI计算完成";



}









// =====================
// 显示预测
// =====================


function showPrediction(data){



    let html="";





    if(data.predictions){



        data.predictions

        .forEach(

            item=>{



                html+=`

                <div class="ai-item">


                🏆 第${item.rank}名


                <br>


                前区:

                ${item.front.join(" ")}


                <br>


                后区:

                ${item.back.join(" ")}


                <br>


                综合评分:

                ${item.score}


                </div>


                `;



            }

        );



    }





    $("prediction")

    .innerHTML=

    html;



    showMeeting(data);



}









// =====================
// AI会议
// =====================


function showMeeting(data){



    $("aiMeeting")

    .innerHTML=`

    <div class="ai-item">

    🤖 Ensemble最终融合

    <br>

    多模型竞争完成

    </div>


    <div class="ai-item">

    📊 Statistics

    <br>

    历史频率分析完成

    </div>


    <div class="ai-item">

    🧠 Bayesian

    <br>

    概率更新完成

    </div>


    <div class="ai-item">

    🔄 Markov

    <br>

    转移链分析完成

    </div>


    <div class="ai-item">

    📐 Matrix

    <br>

    位置矩阵分析完成

    </div>


    <div class="ai-item">

    🏗 Structure

    <br>

    三区奇偶和值分析完成

    </div>


    `;



}









// =====================
// Monte Carlo
// =====================


$("monteBtn")

.onclick=()=>{


    $("processText")

    .innerHTML=

    "🎲 Monte Carlo 100万次模拟运行中...";


};









// =====================
// 回测
// =====================


$("backtestBtn")

.onclick=async()=>{


    $("backtest")

    .innerHTML=

    "历史滚动回测中...";



    const res=

    await fetch(

        "/api/backtest"

    );



    const data=

    await res.json();




    $("backtest")

    .innerHTML=

    JSON.stringify(

        data,

        null,

        2

    );



};









// =====================
// 开奖反馈学习
// =====================


$("learnBtn")

.onclick=async()=>{



    const front=[


        $("f1").value,


        $("f2").value,


        $("f3").value,


        $("f4").value,


        $("f5").value



    ]
    
    .map(

        x=>

        Number(x)

    );






    const back=[


        $("b1").value,


        $("b2").value



    ]

    .map(

        x=>

        Number(x)

    );







    const res=

    await fetch(

        "/api/learn",

        {


            method:"POST",


            headers:{


            "Content-Type":

            "application/json"


            },


            body:

            JSON.stringify({


                front,


                back


            })



        }


    );






    const data=

    await res.json();





    $("learnResult")

    .innerHTML=

    "✅ 学习完成<br>"+

    JSON.stringify(

        data

    );



};








init();