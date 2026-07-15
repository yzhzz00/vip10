// 大乐透AI_V90
// Front Controller
// 网页总控制


window.UI = {


    updateProgress(
        percent,
        text
    ){


        let bar =
        document.getElementById(
            "progressBar"
        );


        let status =
        document.getElementById(
            "progressText"
        );



        if(bar){

            bar.style.width =
            percent+"%";

        }



        if(status){

            status.innerHTML =
            text+
            " "+
            percent+
            "%";

        }


    },






    showResult(
        data
    ){


        let box =
        document.getElementById(
            "result"
        );



        if(box){


            box.innerHTML =

            "<pre>"+
            JSON.stringify(
                data,
                null,
                2
            )
            +
            "</pre>";


        }


    }





};









// 系统启动


async function boot(){



    console.log(
        "大乐透AI V90启动"
    );




    LoadingEngine.init();



    DataEngine.init();



    FeatureEngine.init(
        DataEngine.getHistory()
    );



    TheoryEngine.init();



    MarkovEngine.init(
        DataEngine.getHistory()
    );



    BayesEngine.init(
        DataEngine.getHistory()
    );



    MatrixEngine.init();



    MonteCarloEngine.init();



    TrainingEngine.init();



    PredictionEngine.init();



    ScoringEngine.init();



    RiskEngine.init();



    EvaluationEngine.init(
        DataEngine.getHistory()
    );



    LearningEngine.init();





    MasterEngine.init();





    MasterAgent.init();




    console.log(
        "V90全部模块加载完成"
    );



}









// 开始分析


async function startV90(){



    try{



        LoadingEngine.start(
            "V90 AI分析启动"
        );







        let features =

        FeatureEngine.analyze();






        let theory =

        TheoryEngine.analyze({

            front:[]
            
        });






        let markov =

        MarkovEngine.predictNext(

            DataEngine.getLatest()

        );






        let bayes =

        BayesEngine.predict();






        let monte =

        await MonteCarloEngine.run({

            count:1000000

        });







        let prediction =

        await PredictionEngine.generate({

            theory,


            markov,


            bayes,


            montecarlo:monte


        });







        let risk =

        RiskEngine.evaluate(

            prediction.top[0]

        );







        let report={


            prediction,


            risk,



            time:

            new Date()



        };






        UI.showResult(
            report
        );






        LoadingEngine.finish(
            "分析完成"
        );




        return report;



    }catch(e){



        console.error(e);



        LoadingEngine.finish(
            "分析失败"
        );



    }



}










// 页面加载


window.onload =

boot;