// ======================================
// 彩票智能分析系统 V35.0
// 第一阶段：数据读取核心
// ======================================


let dltData = [];
let pl5Data = [];



// 页面启动
window.onload = function(){

    loadData();

};





// ======================================
// 读取数据
// ======================================


async function loadData(){


    try{


        let dlt = await fetch(
            "data/dlt_raw.txt?v=3500"
        );


        let dltText = await dlt.text();


        dltData = parseData(dltText);



        document.getElementById("dltStatus").innerHTML =
        "已加载";


        document.getElementById("dataCount").innerHTML =
        dltData.length;



        let pl5 = await fetch(
            "data/pl5_raw.txt?v=3500"
        );


        let pl5Text = await pl5.text();


        pl5Data = parseData(pl5Text);



        document.getElementById("pl5Status").innerHTML =
        "已加载";



        document.getElementById("modelStatus").innerHTML =
        "V35.0 数据模块运行成功";



    }

    catch(error){


        console.log(error);



        document.getElementById("modelStatus").innerHTML =
        "数据读取失败";


    }



}






// ======================================
// 数据解析
// ======================================


function parseData(text){


    let arr=[];


    let lines=text.split("\n");



    lines.forEach(line=>{


        let nums=line.match(/\d+/g);



        if(nums && nums.length>=5){


            arr.push(

                nums.map(n=>
                n.padStart(2,"0")
                )

            );


        }



    });



    return arr;


}








// ======================================
// 预测按钮
// ======================================


function startPrediction(){



    if(dltData.length===0){


        alert("数据未加载");


        return;


    }



    document.getElementById("result").innerHTML =


    "V35.0 数据测试完成<br><br>"+

    "大乐透数据："+dltData.length+"期<br>"+

    "排列五数据："+pl5Data.length+"期<br><br>"+

    "预测模块等待开发";



}







// ======================================
// 反馈训练预留
// ======================================


function feedbackTraining(){



    let value=document.getElementById(

        "realResult"

    ).value;



    if(!value){


        alert("请输入开奖结果");


        return;


    }



    document.getElementById(

        "learningStatus"

    ).innerHTML =


    "反馈记录："+value;



}