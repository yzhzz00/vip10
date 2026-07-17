// DLT-AI-CORE VIP
// frontend/app.js
//
// 前端控制逻辑
//
// 功能:
// 1.获取系统状态
// 2.启动AI分析
// 3.显示预测结果
// 4.显示AI会议
// 5.运行回测
// 6.显示学习状态



const statusBox =

document.getElementById(

"status"

);



const resultBox =

document.getElementById(

"result"

);



const committeeBox =

document.getElementById(

"committee"

);



const learningBox =

document.getElementById(

"learning"

);



const messageBox =

document.getElementById(

"message"

);



const bar =

document.getElementById(

"bar"

);









// ======================
// 页面初始化
// ======================

async function loadStatus(){



    try{



        const res =

        await fetch(

        "/api/status"

        );



        const data =

        await res.json();





        statusBox.innerHTML = `

        系统:

        ${data.system}

        <br>

        状态:

        ${data.trained ? "已训练":"未训练"}

        <br>

        模型:

        ${data.models.join(",")}

        `;



    }

    catch(e){



        statusBox.innerHTML=

        "系统连接失败";


    }



}









// ======================
// 开始分析
// ======================

document

.getElementById(

"predictBtn"

)

.onclick=

async function(){





    messageBox.innerHTML=

    "正在读取历史数据...";



    bar.style.width=

    "20%";







    try{



        messageBox.innerHTML=

        "六大模型分析中...";



        bar.style.width=

        "60%";







        const res=

        await fetch(

        "/api/predict",

        {

            method:"POST"

        }

        );





        const data=

        await res.json();







        bar.style.width=

        "100%";



        messageBox.innerHTML=

        "分析完成";







        showPrediction(

            data

        );





    }

    catch(e){



        messageBox.innerHTML=

        "分析失败";



    }




};









// ======================
// 显示预测
// ======================

function showPrediction(data){





    if(

        !data

        ||

        !data.ranking

    ){


        resultBox.innerHTML=

        "暂无预测结果";


        return;


    }






    let html="";







    data.ranking

    .slice(

        0,

        10

    )

    .forEach(

    (item,index)=>{



        html+=`

        <div class="prediction">


        第${index+1}组


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



    });







    resultBox.innerHTML=

    html;







    if(

        data.aiMeeting

    ){



        showCommittee(

            data.aiMeeting

        );



    }



}









// ======================
// AI会议显示
// ======================

function showCommittee(data){





    committeeBox.innerHTML=

    `

    会议时间:

    ${data.time}


    <br><br>


    参与模型:

    ${data.members}


    个


    <br><br>


    推荐组合:

    <br>


    前区:

    ${data.winner.front.join(" ")}


    <br>


    后区:

    ${data.winner.back.join(" ")}


    <br><br>


    置信度:

    ${data.winner.confidence}


    <br><br>


    分析:

    ${data.discussion.reason.join("、")}


    `;



}









// ======================
// 回测
// ======================

document

.getElementById(

"backtestBtn"

)

.onclick=

async function(){



    const res=

    await fetch(

    "/api/backtest",

    {

        method:"POST"

    }

    );



    const data=

    await res.json();





    document

    .getElementById(

    "backtest"

    )

    .innerHTML=

    `


    回测次数:

    ${data.report.total}


    <br>


    3等奖附近:

    ${data.report.hit3}


    <br>


    4等奖附近:

    ${data.report.hit4}


    <br>


    5等奖:

    ${data.report.hit5}


    <br>


    命中率:

    ${data.report.accuracy}%


    `;



};









// ======================
// 学习状态
// ======================

async function loadLearning(){



    const res=

    await fetch(

    "/api/learning"

    );



    const data=

    await res.json();





    learningBox.innerHTML=

    JSON.stringify(

        data,

        null,

        2

    );



}









loadStatus();

loadLearning();