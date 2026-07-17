// DLT-AI-CORE VIP
// web/app.js
//
// 前端控制


const API = "";







// ======================
// 加载系统状态
// ======================


async function loadStatus(){


    try{


        const res =

        await fetch(

            API + "/api/status"

        );



        const data =

        await res.json();







        document.getElementById(

            "status"

        )

        .innerHTML = `


        <p>
        系统:
        ${data.system}
        </p>


        <p>
        数据数量:
        ${data.data.count}
        期
        </p>


        <p>
        模型数量:
        ${data.models.length}
        </p>


        `;



    }

    catch(error){



        document.getElementById(

            "status"

        )

        .innerHTML =

        "系统连接失败";



    }



}









// ======================
// 加载模型
// ======================


async function loadModels(){



    try{


        const res=

        await fetch(

            API + "/api/models"

        );



        const data=

        await res.json();







        document.getElementById(

            "models"

        )

        .innerHTML=



        Object.keys(data)

        .map(

            name=>

            `<p>

            ${name}

            </p>`

        )

        .join("");





    }

    catch(error){



        document.getElementById(

            "models"

        )

        .innerHTML=

        "模型加载失败";



    }



}









// ======================
// 执行预测
// ======================


async function runPredict(){



    const box=

    document.getElementById(

        "result"

    );





    box.innerHTML=

    "AI模型计算中...";







    try{



        const res=

        await fetch(

            API + "/api/predict"

        );





        const data=

        await res.json();







        let html=

        "<h4>预测候选:</h4>";








        data.prediction.forEach(item=>{



            html += `


            <div class="number">


            前区:

            ${item.front.join(" ")}


            <br>


            后区:

            ${item.back.join(" ")}


            <br>


            评分:

            ${item.score}


            </div>


            `;



        });







        box.innerHTML=html;





    }

    catch(error){



        box.innerHTML=

        "预测失败";



    }



}









// ======================
// 页面启动
// ======================


window.onload=function(){



    loadStatus();


    loadModels();



};