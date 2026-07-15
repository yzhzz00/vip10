window.V110_UI={




refresh(){



    let count=

    document.getElementById(

        "dataCount"

    );



    if(count){


        count.innerHTML=

        V110_ENGINE.history.length;


    }




},







showPrediction(result){



    let box=

    document.getElementById(

        "resultBox"

    );





    if(!box)

        return;







    let html=



    `

    <h3>
    AI最终预测
    </h3>


    前区：

    ${

    result.best.front.join(" ")

    }


    <br>


    后区：

    ${

    result.best.back.join(" ")

    }


    <br><br>


    AI可信度：

    ${

    result.confidence

    }%


    <br><br>


    AI会议：

    <br>

    `;







    result.conference.members.forEach(

        m=>{


            html+=


            m.name

            +

            " : "

            +

            m.numbers.join(" ")

            +

            "<br>";



        }

    );





    html+=

    "<hr>TOP10<br>";







    result.top10.forEach(

        (x,i)=>{


            html+=


            (

            i+1

            )

            +

            " "

            +

            x.front.join(" ")

            +

            " + "

            +

            x.back.join(" ")

            +

            "<br>";



        }

    );







    box.innerHTML=html;



},







showTraining(data){



    let box=

    document.getElementById(

        "trainingBox"

    );




    if(!box)

        return;





    let report=

    V110_TRAINING.report();






    box.innerHTML=

    `


    最近100期：

    ${

    JSON.stringify(

    report.last100

    )

    }


    <br>


    最近500期：

    ${

    JSON.stringify(

    report.last500

    )

    }


    <br>


    最近1000期：

    ${

    JSON.stringify(

    report.last1000

    )

    }



    `;



}






};