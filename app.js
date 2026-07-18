const btn =
document.getElementById(
"analyze"
);



const type =
document.getElementById(
"lottery"
);



const status =
document.getElementById(
"status"
);



const result =
document.getElementById(
"result"
);





btn.onclick=async()=>{


    status.innerHTML=

    "AI模型启动...";



    result.innerHTML=

    "计算中，请等待...";




    try{



        let url;



        if(
            type.value==="dlt"
        ){

            url="/api/dlt";

        }

        else{


            url="/api/pl5";

        }






        const controller =

        new AbortController();




        const timer =

        setTimeout(

            ()=>controller.abort(),

            60000

        );






        const response =

        await fetch(

            url,

            {

            signal:

            controller.signal

            }

        );





        clearTimeout(timer);





        if(
            !response.ok
        ){


            throw new Error(

            "API错误: "

            +

            response.status

            );


        }





        const data =

        await response.json();





        status.innerHTML=

        `

        分析完成<br>

        数据期数:

        ${data.periods}

        `;






        result.innerHTML=

        `

        <pre>

        ${

        JSON.stringify(

            data,

            null,

            2

        )

        }

        </pre>

        `;





    }

    catch(error){



        status.innerHTML=

        "运行失败";



        result.innerHTML=

        error.message;



    }


};