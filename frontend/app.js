/*
DLT-AI CORE

Frontend Controller

V1.0.0

*/


const resultBox =

document.getElementById(
    "result"
);



const btn =

document.getElementById(
    "analyzeBtn"
);






btn.onclick = async function(){



    resultBox.innerHTML =

    "AI分析中...";




    try{


        const response =

        await fetch(
            "/api/analyze"
        );



        const data =

        await response.json();





        if(
            data.success
        ){


            resultBox.innerHTML =

            JSON.stringify(

                data.data,

                null,

                2

            );


        }
        else{


            resultBox.innerHTML =

            data.error;


        }



    }

    catch(err){


        resultBox.innerHTML =

        err.message;


    }



};