// learning/failureAnalysis.js



function failureAnalysis(
    prediction,
    actual
){



    const report=[];



    const sum1=

    prediction.front.reduce(
        (a,b)=>a+b,
        0
    );



    const sum2=

    actual.front.reduce(
        (a,b)=>a+b,
        0
    );





    if(
        Math.abs(sum1-sum2)>20
    ){

        report.push(
            "和值偏差较大"
        );

    }
    else{

        report.push(
            "和值正常"
        );

    }







    const hit=

    prediction.front.filter(

        n=>

        actual.front.includes(n)

    );





    if(
        hit.length>=3
    ){

        report.push(
            "前区结构较好"
        );

    }
    else{

        report.push(
            "前区命中不足"
        );

    }







    return {


        level:

        hit.length>=3
        ?
        "正常"
        :
        "需要优化",



        hitCount:
        hit.length,



        report



    };


}







module.exports =
failureAnalysis;