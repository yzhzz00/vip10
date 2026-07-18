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
    "AI模型计算中...";



    try{


        let url;



        if(
            type.value==="dlt"
        ){

            url="/api/dlt";

        }else{


            url="/api/pl5";

        }




        const res =
        await fetch(url);



        const data =
        await res.json();




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

    catch(e){


        status.innerHTML=
        "运行失败";


        result.innerHTML=
        e.message;


    }


};