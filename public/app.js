/**
 * DLT-AI-CORE-VIP
 * 前端控制程序
 *
 * 功能：
 * 1. 调用预测接口
 * 2. 调用历史滚动回测接口
 * 3. 显示结果
 */



const resultBox =
    document.getElementById("result");



/**
 * 大乐透预测
 */
async function predict(){

    resultBox.innerHTML =
        "正在计算预测...";


    try{

        const res =
            await fetch(
                "/api/predict"
            );


        const data =
            await res.json();


        resultBox.innerHTML =
            JSON.stringify(
                data,
                null,
                2
            );


    }
    catch(error){

        resultBox.innerHTML =
            "预测失败:" + error;

    }

}




/**
 * 历史滚动回测
 */
async function backtest(){

    resultBox.innerHTML =
        "正在执行历史滚动回测，请等待...";


    try{


        const res =
            await fetch(
                "/api/backtest"
            );


        const data =
            await res.json();



        resultBox.innerHTML =
            JSON.stringify(
                data,
                null,
                2
            );


    }
    catch(error){


        resultBox.innerHTML =
            "回测失败:" + error;


    }


}
