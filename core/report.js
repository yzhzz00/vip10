// DLT-AI-CORE V11 FINAL
// core/report.js
// 分析报告生成


class ReportEngine {


    constructor(){


        this.version =
        "V11 FINAL";


    }









    create(result){


        return {


            version:
            this.version,


            time:
            new Date()
            .toISOString(),



            prediction:
            result.prediction
            ||
            null,



            ranking:
            result.ranking
            ||
            [],



            score:
            result.score
            ||
            null,



            confidence:
            result.confidence
            ||
            null,



            theory:
            result.theory
            ||
            null,



            models:
            result.models
            ||
            null



        };


    }









    summary(report){


        return {


            prediction:
            report.prediction,


            confidence:
            report.confidence,


            score:
            report.score,


            status:
            this.status(
                report
            )



        };


    }









    status(report){


        if(
            !report.score
        ){


            return "waiting";


        }



        if(
            report.confidence
            &&
            report.confidence.confidence
            <
            40
        ){


            return "low-confidence";


        }



        return "ready";


    }



}



export default ReportEngine;