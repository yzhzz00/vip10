/**
 * DLT-AI-CORE VIP
 * 前端控制
 */


const api = "";





/**
 * 页面启动
 */
window.onload = async function(){


    await loadStatus();


};






/**
 * 获取系统状态
 */
async function loadStatus(){


    try{


        const res =
        await fetch(
            api+"/api/status"
        );


        const data =
        await res.json();



        document
        .getElementById(
            "status"
        )
        .innerText =
        JSON.stringify(
            data,
            null,
            2
        );



        const d =
        await fetch(
            api+"/api/data"
        );


        const dataInfo =
        await d.json();



        document
        .getElementById(
            "data"
        )
        .innerText =
        JSON.stringify(
            dataInfo,
            null,
            2
        );



    }catch(error){



        document
        .getElementById(
            "status"
        )
        .innerText =
        "服务器连接失败";



    }


}






/**
 * 开始预测
 */
async function predict(){


    show(
        "正在计算预测..."
    );



    const res =
    await fetch(
        api+"/api/predict"
    );



    const data =
    await res.json();



    show(
        data
    );


}







/**
 * Monte Carlo
 */
async function monteCarlo(){


    show(
        "百万次模拟开始..."
    );



    const res =
    await fetch(
        api+"/api/montecarlo"
    );



    const data =
    await res.json();



    show(
        data
    );


}






/**
 * 回测
 */
async function backtest(){


    show(
        "正在执行历史回测..."
    );



    const res =
    await fetch(
        api+"/api/backtest"
    );



    const data =
    await res.json();



    show(
        data
    );


}







/**
 * 开奖反馈学习
 */
async function learn(){



    const front =
    document
    .getElementById(
        "front"
    )
    .value;



    const back =
    document
    .getElementById(
        "back"
    )
    .value;





    const res =
    await fetch(
        api+"/api/learn",
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




    const data =
    await res.json();




    document
    .getElementById(
        "learn"
    )
    .innerText =

    JSON.stringify(
        data,
        null,
        2
    );


}








/**
 * 输出结果
 */
function show(
    data
){


    document
    .getElementById(
        "result"
    )
    .innerText =

    JSON.stringify(
        data,
        null,
        2
    );


}