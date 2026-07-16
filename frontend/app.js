// frontend/app.js


/*
    DLT-AI CORE V1.0

    Frontend Controller

*/





const API =

"http://localhost:3000";








// 页面加载检测服务器


window.onload =

async function(){


    try{


        const res =

        await fetch(
            API
        );



        const data =

        await res.json();



        document
        .getElementById(
            "status"
        )
        .innerHTML =


        "系统在线: "

        +

        data.system;



    }

    catch(error){



        document
        .getElementById(
            "status"
        )
        .innerHTML =


        "服务器未连接";


    }


};











// 开始分析按钮


document
.getElementById(
    "start"
)
.onclick =

async function(){



    const resultBox =

    document
    .getElementById(
        "result"
    );



    resultBox.innerHTML =

    "<p class='loading'>AI分析中...</p>";





    try{


        const res =

        await fetch(

            API
            +
            "/api/analyze"

        );



        const data =

        await res.json();





        if(
            !data.success
        ){

            throw new Error(
                data.error
            );

        }






        renderResult(

            data.data.ranking

        );




    }

    catch(error){



        resultBox.innerHTML =

        "分析失败:"
        +
        error.message;


    }



};












// 显示TOP10


function renderResult(
    list
){



    const box =

    document
    .getElementById(
        "result"
    );



    box.innerHTML="";





    list.forEach(
        item=>{


            const div =

            document.createElement(
                "div"
            );



            div.className =
            "result-item";



            div.innerHTML =



            `
            <div class="rank">

            TOP ${item.rank}

            </div>


            <p>

            ${item.number}

            </p>


            <p class="score">

            综合评分:
            ${item.score}

            </p>


            <p>

            等级:
            ${item.level}

            </p>


            <p>

            模型支持:
            ${item.support.join(",")}

            </p>

            `;



            box.appendChild(
                div
            );



        }
    );



}












// 开奖反馈


document
.getElementById(
    "feedback"
)
.onclick =

async function(){



    const body={



        issue:

        document
        .getElementById(
            "issue"
        )
        .value,



        front:

        document
        .getElementById(
            "front"
        )
        .value,



        back:

        document
        .getElementById(
            "back"
        )
        .value



    };





    const res =

    await fetch(

        API
        +
        "/api/feedback",

        {


            method:"POST",


            headers:{


                "Content-Type":
                "application/json"


            },


            body:

            JSON.stringify(body)


        }

    );





    const data =

    await res.json();




    alert(
        data.message
    );



};