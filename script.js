// ======================================
// 彩票智能分析系统 V35.8
// script.js
// 页面控制层
// ======================================


let dltData=[];



window.onload=function(){


    loadData();



    document
    .getElementById("predictBtn")
    .onclick=function(){


        startAnalysis();


    };



    document
    .getElementById("feedbackBtn")
    .onclick=function(){


        feedback();


    };



};







// ==============================
// 加载大乐透数据
// ==============================


async function loadData(){


    try{


        let res =
        await fetch(
        "data/dlt_raw.txt?v=358"
        );



        let text =
        await res.text();




        dltData =
        parseData(text);





        document
        .getElementById("dltStatus")
        .innerHTML=
        "已加载";




        document
        .getElementById("dataCount")
        .innerHTML=
        dltData.length;




        document
        .getElementById("systemStatus")
        .innerHTML=
        "V35.8数据模块运行正常";




    }
    catch(e){



        document
        .getElementById("systemStatus")
        .innerHTML=
        "数据读取失败";



        console.log(e);



    }



}







// ==============================
// 数据解析
// ==============================


function parseData(text){



    let arr=[];



    text
    .split(/\r?\n/)
    .forEach(line=>{



        let a =
        line.trim()
        .split(/\s+/);





        if(a.length<9)
        return;





        let front=[];

        let back=[];






        for(
        let i=2;
        i<=6;
        i++
        ){


            front.push(
            String(
            Number(a[i])
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
            Number(a[i])
            )
            .padStart(2,"0")
            );



        }






        arr.push({


            front:front,


            back:back



        });



    });





    return arr;



}
// ======================================
// V35.8 script.js
// Part 2/3
// 调用 engine.js
// 输出预测结果
// ======================================





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






    let resultBox =
    document.getElementById(
    "result"
    );






    resultBox.innerHTML =

    "正在运行 V35.8 综合模型...<br>" +

    "蒙特卡罗模拟：100000组<br>" +

    "请稍候...";








    setTimeout(()=>{



        try{





            // 加载数据到引擎


            DLTEngine.data =
            dltData;






            // 执行模型


            let result =
            DLTEngine.run();







            showResult(result);







        }
        catch(e){





            resultBox.innerHTML=

            "模型运行错误："+
            e;





            console.log(e);





        }





    },100);





}









// ==============================
// 显示结果
// ==============================


function showResult(result){



    let html="";





    html +=

    "<b>彩票智能分析系统 V35.8</b><br><br>";





    html +=

    "数据期数："+
    dltData.length+
    "期<br><br>";





    html +=

    "蒙特卡罗模拟：100000组<br><br>";





    html +=

    "<b>最终推荐</b><br><br>";









    if(!result ||
       result.length===0){



        html +=

        "暂无符合条件方案";



    }
    else{






        result.forEach(
        (item,index)=>{






            html +=

            "方案"+
            (index+1)+
            "：";






            html +=

            item.front.join(" ");






            html +=

            " + ";






            html +=

            item.back.join(" ");






            html +=

            "<br>";






            html +=

            "综合评分："+
            item.score+
            "分";







            html +=

            "<br><br>";






        });






    }








    html +=

    "模型状态：V35.8综合模型完成";








    document
    .getElementById("result")
    .innerHTML=
    html;







    document
    .getElementById("systemStatus")
    .innerHTML=

    "V35.8模型运行成功<br>"+
    dltData.length+
    "期历史数据参与计算";



}
// ======================================
// V35.8 script.js
// Part 3/3
// 反馈学习 + 回测接口
// ======================================





// ==============================
// 开奖反馈
// ==============================


function feedback(){



    let input =
    document.getElementById(
    "realResult"
    );





    if(
    !input ||
    input.value.trim()===""
    ){



        alert(
        "请输入开奖结果"
        );



        return;



    }






    let value =
    input.value.trim();






    document
    .getElementById(
    "learningStatus"
    )
    .innerHTML=

    "已记录开奖反馈："+
    value+
    "<br>"+
    "V35.8学习接口等待训练";





}









// ==============================
// 历史回测
// ==============================


function runBackTest(){



    if(dltData.length===0){



        return;



    }







    DLTEngine.data =
    dltData;







    let result =
    DLTEngine.backTest();







    console.log(
    "回测结果:",
    result
    );






    document
    .getElementById(
    "learningStatus"
    )
    .innerHTML=



    "历史回测完成<br>"+

    "测试期数："+

    result.periods+

    "<br>"+

    "3个号码以上命中："+

    result.hit3+

    "<br>"+

    "4个号码以上命中："+

    result.hit4+

    "<br>"+

    "5个号码命中："+

    result.hit5;



}









// ==============================
// 获取模型状态
// ==============================


function getSystemInfo(){



    if(
    typeof DLTEngine==="undefined"
    ){


        return;


    }





    let info =
    DLTEngine.status();





    console.log(info);



}








// ======================================
// V35.8 script.js END
// ======================================