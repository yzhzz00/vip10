const btn =
document.getElementById("analyze");


const saveBtn =
document.getElementById("save");


const status =
document.getElementById("status");


const result =
document.getElementById("result");


const bar =
document.getElementById("bar");


const progressText =
document.getElementById("progress-text");








function setProgress(value,text){


    if(bar){

        bar.style.width =
        value+"%";

    }



    if(progressText){

        progressText.innerHTML =
        text+" "+value+"%";

    }


}








function showModels(){


    const box =
    document.getElementById(
        "ai-room"
    );



    if(!box)return;



    box.innerHTML=


    `

    <div class="model">

    贝叶斯模型

    → 概率分析

    </div>


    <div class="model">

    马尔可夫模型

    → 转移预测

    </div>


    <div class="model">

    蒙特卡罗

    → 组合模拟

    </div>


    <div class="model">

    遗传优化

    → 筛选

    </div>


    <div class="model">

    融合模型

    → 最终评分

    </div>


    `;


}








async function loadStatus(){


    try{


        const res =

        await fetch(

            "/api/status"

        );


        const data =

        await res.json();





        const dlt =

        document.getElementById(
            "dlt-count"
        );


        const pl5 =

        document.getElementById(
            "pl5-count"
        );




        if(dlt){

            dlt.innerHTML =
            data.dlt || 0;

        }



        if(pl5){

            pl5.innerHTML =
            data.pl5 || 0;

        }


    }

    catch(e){}


}









async function loadLearning(){


    try{


        const res =

        await fetch(

            "/api/learning"

        );


        const data =

        await res.json();





        const box =

        document.getElementById(
            "learning"
        );



        if(box){



            box.innerHTML =


            `

            样本:

            ${data.samples}


            <br>


            有效反馈:

            ${data.hitSamples}


            <br>


            学习率:

            ${data.rate}%


            `;



        }



    }

    catch(e){}



}









async function loadHistory(){


    try{


        const res=

        await fetch(

            "/api/history"

        );



        const data=

        await res.json();




        const box=

        document.getElementById(
            "history"
        );



        if(!box)return;




        box.innerHTML=



        data.map(item=>{


            return `

            第${item.period}期

            ${item.front.join(" ")}

            +

            ${item.back.join(" ")}

            `;



        }).join(

            "<br>"

        );



    }

    catch(e){}



}









async function loadTrend(){


    try{


        const res=

        await fetch(

            "/api/trend"

        );



        const data=

        await res.json();





        const box=

        document.getElementById(
            "trend"
        );



        if(!box)return;





        box.innerHTML=


        `


        🔥 热号:

        ${

        data.hot.map(

            x=>

            x.number

        ).join(" ")

        }



        <br>



        ❄ 冷号:

        ${

        data.cold.map(

            x=>

            x.number

        ).join(" ")

        }



        <br>


        奇:

        ${data.odd}


        偶:

        ${data.even}



        `;



    }

    catch(e){}



}









async function runAI(){


    status.innerHTML=

    "AI模型计算中";



    showModels();



    setProgress(
        20,
        "读取历史"
    );



    setProgress(
        50,
        "模型计算"
    );



    try{


        const res=

        await fetch(

            "/api/dlt"

        );



        const data=

        await res.json();





        setProgress(

            100,

            "完成"

        );



        status.innerHTML=

        "分析完成";



        renderResult(data);



    }

    catch(e){



        status.innerHTML=

        "失败";

    }



}









function renderResult(data){



    if(

        !data.prediction

    ){


        result.innerHTML=

        JSON.stringify(

            data,

            null,

            2

        );


        return;


    }






    result.innerHTML=



    data.prediction.map(

        (item,index)=>{


            return `


            <div class="result-card">


            TOP ${index+1}


            <br>


            ${

            item.front.join(" ")

            }


            +

            ${

            item.back.join(" ")

            }



            <br>


            评分:

            ${

            item.score || "-"

            }



            </div>


            `;


        }

    ).join("");



}









async function saveFeedback(){



    const input =

    document.getElementById(
        "feedback"
    );



    if(!input)return;




    await fetch(

        "/api/feedback",

        {


        method:

        "POST",


        headers:{


        "Content-Type":

        "application/json"


        },


        body:

        JSON.stringify({

            result:

            input.value


        })

        }

    );



    input.value="";



    loadLearning();


}









if(btn){

btn.onclick=

runAI;

}



if(saveBtn){

saveBtn.onclick=

saveFeedback;

}







loadStatus();

loadHistory();

loadTrend();

loadLearning();