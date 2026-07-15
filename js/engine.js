window.V110_ENGINE={



history:[],



result:null,






// =====================
// 启动系统
// =====================

async init(){



    let response=

    await fetch(

        V110_CONFIG.dataFile

    );



    let text=

    await response.text();





    this.history=

    V110_PARSER.parse(

        text

    );





    V110_DB.saveHistory(

        this.history

    );





    V110_UI.refresh();



},









// =====================
// AI分析
// =====================


analyze(){



    this.result=

    V110_PREDICTOR.predict(

        this.history

    );




    V110_UI.showPrediction(

        this.result

    );



},









// =====================
// 开始训练
// =====================


train(){



    let result=

    V110_TRAINING.run(

        this.history

    );





    V110_UI.showTraining(

        result

    );



},









// =====================
// 成长报告
// =====================


report(){



    return V110_TRAINING.report();



}







};








document.addEventListener(

"DOMContentLoaded",

()=>{


    V110_ENGINE.init();



});