// learning/failureAnalysis.js


/*
    DLT-AI CORE V1.0

    Failure Analysis

    功能:

    预测失败原因分析

*/






function analyzeSum(
    predict,
    actual
){


    const diff =

    Math.abs(
        predict.sum
        -
        actual.sum
    );



    if(diff<=5){

        return "和值判断准确";

    }



    if(diff<=15){

        return "和值轻微偏差";

    }



    return "和值预测偏离较大";

}







function analyzeSpan(
    predict,
    actual
){


    const diff =

    Math.abs(
        predict.span
        -
        actual.span
    );



    if(diff<=3){

        return "跨度预测稳定";

    }


    return "跨度判断需要修正";


}








function analyzeZone(
    predict,
    actual
){


    if(
        predict.zone
        ===
        actual.zone
    ){

        return "三区结构正确";

    }



    return "三区结构判断错误";


}








function failureAnalysis(
    prediction,
    actual
){



    const report=[];




    report.push(

        analyzeSum(
            prediction,
            actual
        )

    );



    report.push(

        analyzeSpan(
            prediction,
            actual
        )

    );



    report.push(

        analyzeZone(
            prediction,
            actual
        )

    );







    let level;



    const errors =

    report.filter(
        item =>
        item.includes(
            "错误"
        )
        ||
        item.includes(
            "偏离"
        )
    ).length;





    if(errors===0){

        level="优秀";

    }

    else if(errors===1){

        level="正常";

    }

    else{

        level="需要优化";

    }






    return {


        level,


        report,



        time:

        new Date()
        .toISOString()


    };



}





module.exports =
failureAnalysis;