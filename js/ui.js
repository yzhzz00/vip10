window.V110_UI = {



    // ======================
    // 初始化页面
    // ======================

    init(){



        let analyzeBtn =

        document.getElementById(
            "analyzeBtn"
        );



        if(analyzeBtn){


            analyzeBtn.onclick=()=>{


                V110_ENGINE.analyze();


            };


        }








        let trainBtn =

        document.getElementById(
            "trainBtn"
        );



        if(trainBtn){



            trainBtn.onclick=()=>{


                V110_ENGINE.train();


            };


        }








        let feedbackBtn =

        document.getElementById(
            "feedbackBtn"
        );



        if(feedbackBtn){



            feedbackBtn.onclick=()=>{


                this.saveFeedback();


            };


        }





    },









    // ======================
    // 保存开奖反馈
    // ======================

    saveFeedback(){



        let period =

        document.getElementById(
            "periodInput"
        )
        .value;





        let front =

        document.getElementById(
            "frontInput"
        )
        .value
        .trim()
        .split(/\s+/)
        .map(Number);







        let back =

        document.getElementById(
            "backInput"
        )
        .value
        .trim()
        .split(/\s+/)
        .map(Number);







        if(
            !period ||
            front.length!==5 ||
            back.length!==2
        ){


            alert(
                "请输入完整开奖数据"
            );


            return;


        }







        V110_LEARNING.saveFeedback({



            period,


            front,


            back,


            time:
            Date.now()



        });






        alert(

            "开奖反馈已保存"

        );



    },









    // ======================
    // 训练进度显示
    // ======================

    progress(current,total){



        let box =

        document.getElementById(
            "progressBox"
        );



        if(box){



            let p =

            Math.floor(

                current /
                total *
                100

            );





            box.innerHTML=

            `

            训练进度：

            ${p}%


            `;



        }



    }






};







// 页面加载


document.addEventListener(

"DOMContentLoaded",

()=>{


    V110_ENGINE.init();



    V110_UI.init();



});