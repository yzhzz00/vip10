/**
 * DLT-AI-CORE VIP
 * Frontend V4.0 FINAL
 */


const state={

    progress:0,

    timer:null,

    prediction:null

};







function startPrediction(){


    resetUI();


    startProgress();



    fetch("/api/predict")

    .then(

        res=>

        res.json()

    )

    .then(

        data=>{


            stopProgress();


            state.prediction=data;


            renderPrediction(

                data

            );


            renderMeeting();


        }

    )

    .catch(

        err=>{


            stopProgress();


            showError(

                err

            );


        }

    );



}









function startProgress(){


    const bar=

    document.getElementById(

        "progress"

    );



    state.progress=0;






    state.timer=setInterval(

        ()=>{


            if(

                state.progress<90

            ){


                state.progress++;


                bar.style.width=

                state.progress+"%";


                document

                .getElementById(

                    "progressText"

                )

                .innerText=

                state.progress+"%";



            }



        },

        80

    );



}









function stopProgress(){


    clearInterval(

        state.timer

    );



    state.progress=100;



    document

    .getElementById(

        "progress"

    )

    .style.width=

    "100%";



    document

    .getElementById(

        "progressText"

    )

    .innerText=

    "100% 完成";



}









function renderPrediction(

    data

){



    const box=

    document

    .getElementById(

        "prediction"

    );



    box.innerHTML="";






    data.predictions.forEach(

        item=>{



            box.innerHTML+=`


<div class="card">


<h3>
🏆 第${item.rank}名
</h3>


<p>

前区：

<b>

${item.front.join(" ")}

</b>

</p>


<p>

后区：

<b>

${item.back.join(" ")}

</b>

</p>



<p>

综合评分：

${item.score}

</p>


</div>


`;



        }

    );



}









function renderMeeting(){



    const box=

    document

    .getElementById(

        "meeting"

    );



    box.innerHTML=`


<div>

🤖 Ensemble

<br>

✅ 多模型融合完成

</div>


<div>

📊 Statistics

<br>

✅ 历史频率评分完成

</div>



<div>

🧠 Bayesian

<br>

✅ 概率更新完成

</div>


<div>

🔄 Markov

<br>

✅ 转移分析完成

</div>


<div>

📐 Matrix

<br>

✅ 位置矩阵完成

</div>



<div>

🏗 Structure

<br>

✅ 结构过滤完成

</div>


`;



}









function submitFeedback(){



    const front=[];

    const back=[];





    for(

        let i=1;

        i<=5;

        i++

    ){



        front.push(

            Number(

                document

                .getElementById(

                    "front"+i

                )

                .value

            )

        );



    }







    for(

        let i=1;

        i<=2;

        i++

    ){



        back.push(

            Number(

                document

                .getElementById(

                    "back"+i

                )

                .value

            )

        );



    }







    fetch(

        "/api/learn",

        {


            method:"POST",


            headers:{


                "Content-Type":

                "application/json"


            },


            body:JSON.stringify({


                front,


                back


            })


        }

    )

    .then(

        r=>

        r.json()

    )

    .then(

        data=>{


            renderLearning(

                data

            );


        }

    );



}









function renderLearning(

    data

){



    document

    .getElementById(

        "learning"

    )

    .innerHTML=`


🧠 历史滚动学习


<br>


学习次数：

${data.total}


<br>


状态：

${data.status}


`;



}









function resetUI(){



    document

    .getElementById(

        "prediction"

    )

    .innerHTML=

    "AI计算中...";



    document

    .getElementById(

        "meeting"

    )

    .innerHTML=

    "模型会议启动...";



}



window.startPrediction=

startPrediction;



window.submitFeedback=

submitFeedback;