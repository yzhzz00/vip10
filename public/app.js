// DLT-AI-CORE V11 FINAL
// public/app.js
// 前端接口控制



async function checkStatus(){


    try{


        const res =

        await fetch(

            "/api/status"

        );



        const data =

        await res.json();




        document.getElementById(

            "status"

        ).innerHTML =


        `

        系统状态: ${data.status}<br>

        历史数据: ${data.history} 期<br>

        模型:

        ${data.models.join(",")}

        `;



    }


    catch(error){


        document.getElementById(

            "status"

        ).innerHTML =


        "检测失败: "+error.message;


    }



}









async function predict(){



    const bar =

    document.getElementById(

        "bar"

    );



    const loading =

    document.getElementById(

        "loading"

    );



    const result =

    document.getElementById(

        "result"

    );






    try{



        loading.innerHTML =

        "正在计算...";



        bar.style.width="10%";

        bar.innerHTML="10%";






        const timer =

        setInterval(()=>{


            let value =

            parseInt(

                bar.style.width

                ||

                0

            );



            if(
                value < 90
            ){



                value += 5;



                bar.style.width=

                value+"%";



                bar.innerHTML=

                value+"%";



            }



        },300);








        const res =

        await fetch(

            "/api/predict",

            {

                method:"POST",


                headers:{


                    "Content-Type":

                    "application/json"


                },


                body:

                JSON.stringify({})

            }

        );






        const data =

        await res.json();





        clearInterval(timer);





        bar.style.width="100%";

        bar.innerHTML="100%";






        loading.innerHTML=

        "分析完成";






        if(data.error){



            result.innerHTML=

            "分析失败: "

            +

            data.error;



            return;

        }







        result.innerHTML =



        `

        <h4>推荐号码</h4>


        前区:

        ${data.front.join(" ")}

        <br><br>


        后区:

        ${data.back.join(" ")}


        <h4>模型状态</h4>


        ${Object.keys(data.models).join(",")}

        `;





    }


    catch(error){



        result.innerHTML=

        "分析失败: "

        +

        error.message;



    }




}









async function backtest(){



    const box =

    document.getElementById(

        "backtest"

    );



    try{



        box.innerHTML=

        "正在回测...";






        const res =

        await fetch(

            "/api/backtest",

            {


                method:"POST",


                headers:{


                    "Content-Type":

                    "application/json"


                },


                body:

                JSON.stringify({

                    limit:100

                })

            }

        );






        const data =

        await res.json();






        box.innerHTML =


        `

        回测期数:

        ${data.period || 0}

        <br>


        前区3个命中率:

        ${data.front3Rate || 0}%

        <br>


        前区4个命中率:

        ${data.front4Rate || 0}%

        <br>


        前区5个命中率:

        ${data.front5Rate || 0}%

        <br>


        后区2个命中率:

        ${data.back2Rate || 0}%


        `;



    }


    catch(error){


        box.innerHTML=

        "回测失败: "

        +

        error.message;



    }



}









async function learning(){



    try{



        const res =

        await fetch(

            "/api/learning"

        );



        const data =

        await res.json();





        document.getElementById(

            "learning"

        ).innerHTML =



        `

        学习次数:

        ${data.times || 0}


        <br><br>


        ${JSON.stringify(

            data.committee,

            null,

            2

        )}


        `;



    }


    catch(error){



        document.getElementById(

            "learning"

        ).innerHTML=

        error.message;



    }



}







window.onload=function(){


    checkStatus();


    learning();


};