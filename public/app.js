/**
 * DLT-AI-CORE VIP
 * Frontend Controller V2.0
 */


const api = "";





window.onload = async function(){

    await loadStatus();

};






// =============================
// 系统状态
// =============================

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

        "系统运行正常\n\n"

        +

        "历史数据："

        +

        data.history

        +

        "期\n\n"

        +

        "模型数量："

        +

        data.models.length
        ;





        const d =
        await fetch(
            api+"/api/data"
        );



        const info =
        await d.json();




        if(
            info.latest
        ){


            document
            .getElementById(
                "data"
            )
            .innerText =


            "最新开奖："

            +

            info.latest.issue

            +

            "\n\n前区："

            +

            formatNumbers(
                info.latest.front
            )

            +

            "\n后区："

            +

            formatNumbers(
                info.latest.back
            );



        }




    }catch(e){



        document
        .getElementById(
            "status"
        )
        .innerText =
        "服务器连接失败";

    }


}








// =============================
// 开始预测
// =============================


async function predict(){


    setResult(
        "AI模型计算中..."
    );



    const res =
    await fetch(
        api+"/api/predict"
    );



    const data =
    await res.json();



    renderPrediction(
        data
    );


}








// =============================
// Monte Carlo
// =============================


async function monteCarlo(){


    setResult(
        "正在执行Monte Carlo模拟..."
    );



    const res =
    await fetch(
        api+"/api/montecarlo"
    );



    const data =
    await res.json();



    setResult(

        "🎲 Monte Carlo模拟完成\n\n"

        +

        JSON.stringify(
            data,
            null,
            2
        )

    );


}







// =============================
// 回测
// =============================


async function backtest(){


    setResult(
        "正在回测..."
    );



    const res =
    await fetch(
        api+"/api/backtest"
    );



    const data =
    await res.json();



    let text =

    "📊 历史回测结果\n\n";



    if(
        data["100期"]
    ){


        text +=

        "100期\n"

        +

        "前区准确率："

        +

        data["100期"]
        .frontAccuracy

        +

        "%\n"

        +

        "后区准确率："

        +

        data["100期"]
        .backAccuracy

        +

        "%\n\n";


    }



    if(
        data["500期"]
    ){


        text +=

        "500期\n"

        +

        "前区准确率："

        +

        data["500期"]
        .frontAccuracy

        +

        "%\n\n";


    }




    if(
        data["1000期"]
    ){


        text +=

        "1000期\n"

        +

        "前区准确率："

        +

        data["1000期"]
        .frontAccuracy

        +

        "%";


    }



    setResult(
        text
    );


}








// =============================
// 开奖反馈
// =============================


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


    "学习完成\n\n"

    +

    "累计学习："

    +

    data.totalLearning

    +

    "次";


}








// =============================
// 预测结果显示
// =============================


function renderPrediction(
    data
){



    if(
        !data.predictions
    ){


        setResult(
            JSON.stringify(
                data,
                null,
                2
            )
        );


        return;

    }




    let text =

    "🎯 大乐透智能预测\n\n";





    data.predictions
    .forEach(

        item=>{


            text +=

            "NO."

            +

            item.rank

            +

            "\n\n";


            text +=

            "前区："

            +

            formatNumbers(
                item.front
            )

            +

            "\n";


            text +=

            "后区："

            +

            formatNumbers(
                item.back
            )

            +

            "\n";


            text +=

            "综合评分："

            +

            item.score;


            text +=

            "\n\n----------------\n\n";


        }

    );



    setResult(
        text
    );


}








// =============================
// 工具
// =============================


function formatNumbers(
    arr=[]
){


    return arr
    .map(

        n=>

        String(n)
        .padStart(
            2,
            "0"
        )

    )
    .join(" ");


}







function setResult(
    text
){


    document
    .getElementById(
        "result"
    )
    .innerText =
    text;


}