// DLT-AI-CORE VIP
// 前端控制


function setProgress(num){


    const bar =

    document.getElementById(

        "bar"

    );


    bar.style.width=

    num+"%";


    bar.innerHTML=

    num+"%";


}









async function startPredict(){



    setProgress(10);



    document.getElementById(

        "result"

    ).innerHTML=

    "正在读取历史数据...";





    setProgress(30);





    const data=

    await API.predict();






    setProgress(100);






    let html="";





    data.result.forEach(

        (item,index)=>{


            html+=`

            <p>

            第${index+1}组

            前区:

            ${item.front.join(" ")}

            <br>

            后区:

            ${item.back.join(" ")}

            <br>

            评分:

            ${item.score}

            </p>

            `;


        }

    );







    document.getElementById(

        "result"

    ).innerHTML=html;





    loadStatus();


}









async function runBacktest(){



    const data=

    await API.backtest(100);





    document.getElementById(

        "backtest"

    ).innerHTML=

    `

    回测期数:${data.period}

    <br>

    前区3个:

    ${data.rate.front3}

    <br>

    前区4个:

    ${data.rate.front4}

    <br>

    前区5个:

    ${data.rate.front5}

    <br>

    后区2个:

    ${data.rate.back2}

    `;



}









async function loadStatus(){



    const status=

    await API.status();



    document.getElementById(

        "status"

    ).innerHTML=

    JSON.stringify(

        status

    );





    const learning=

    await API.learning();





    document.getElementById(

        "learning"

    ).innerHTML=

    `学习次数:${learning.learningTimes}`;





}



loadStatus();