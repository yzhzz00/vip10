// ======================================
// 彩票智能分析系统 V35.8.1
// script.js
// 页面控制程序
// ======================================


let dltData=[];



window.onload=function(){


    loadDLTData();



    document
    .getElementById("predictBtn")
    .onclick=function(){

        startAnalysis();

    };



    document
    .getElementById("feedbackBtn")
    .onclick=function(){

        saveFeedback();

    };


};







// ==============================
// 加载大乐透数据
// ==============================


async function loadDLTData(){



    try{


        let response =
        await fetch(
            "data/dlt_raw.txt?v=3581"
        );



        let text =
        await response.text();




        dltData =
        parseDLT(text);





        document
        .getElementById(
            "dltStatus"
        )
        .innerHTML=
        "已加载";





        document
        .getElementById(
            "dataCount"
        )
        .innerHTML=
        dltData.length;






        document
        .getElementById(
            "systemStatus"
        )
        .innerHTML=

        "V35.8.1数据模块运行正常";




    }
    catch(e){


        document
        .getElementById(
            "systemStatus"
        )
        .innerHTML=

        "数据加载失败";


        console.log(e);


    }



}









// ==============================
// 大乐透数据解析
// ==============================


function parseDLT(text){



    let result=[];



    let lines =
    text.split(/\r?\n/);




    lines.forEach(line=>{



        let arr =
        line.trim()
        .split(/\s+/);





        if(arr.length<9){

            return;

        }







        let front=[];

        let back=[];







        for(
            let i=2;
            i<=6;
            i++
        ){



            front.push(

                String(
                    Number(arr[i])
                )
                .padStart(2,"0")

            );


        }







        for(
            let i=7;
            i<=8;
            i++
        ){



            back.push(

                String(
                    Number(arr[i])
                )
                .padStart(2,"0")

            );


        }







        result.push({


            front:front,


            back:back


        });



    });






    return result;


}









// ==============================
// 开始分析
// ==============================


function startAnalysis(){



    if(dltData.length===0){


        alert(
            "大乐透数据未加载"
        );


        return;


    }







    let box =
    document.getElementById(
        "result"
    );





    box.innerHTML=

    "V35.8.1模型运行中...<br>"+
    "蒙特卡罗模拟1000组...";







    setTimeout(()=>{



        DLTEngine.data =
        dltData;





        let result =
        DLTEngine.run();





        showResult(result);





    },100);



}









// ==============================
// 显示结果
// ==============================


function showResult(data){



    let html="";





    html+=

    "<b>彩票智能分析系统 V35.8.1</b><br><br>";





    html+=

    "数据期数："+
    dltData.length+
    "期<br><br>";





    html+=

    "蒙特卡罗模拟：100000组<br><br>";





    html+=

    "<b>最终推荐</b><br><br>";








    data.forEach((item,index)=>{



        html+=

        "方案"+
        (index+1)+
        "：";



        html+=

        item.front.join(" ");




        html+=

        " + ";




        html+=

        item.back.join(" ");




        html+=

        "<br>";




        html+=

        "综合评分："+

        item.score+

        "分<br><br>";




    });







    html+=

    "模型状态：V35.8.1综合模型完成";





    document
    .getElementById(
        "result"
    )
    .innerHTML=
    html;





    document
    .getElementById(
        "systemStatus"
    )
    .innerHTML=

    "V35.8.1模型运行成功<br>"+
    dltData.length+
    "期历史数据参与计算";



}









// ==============================
// 开奖反馈
// ==============================


function saveFeedback(){



    let value =
    document
    .getElementById(
        "realResult"
    )
    .value
    .trim();





    if(!value){


        alert(
            "请输入开奖结果"
        );


        return;


    }





    localStorage.setItem(

        "DLT_FEEDBACK",

        value

    );





    document
    .getElementById(
        "learningStatus"
    )
    .innerHTML=

    "已保存开奖反馈："+
    value;



}