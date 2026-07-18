/**
 * DLT-AI-CORE VIP
 * 输出管理引擎
 */


import {
    saveJSON,
    readJSON
} from "../utils/helper.js";



class OutputEngine {



    static predictionFile =
    "./data/prediction_history.json";


    static backtestFile =
    "./data/backtest_history.json";




    /**
     * 保存预测
     */
    static savePrediction(
        data
    ){


        const history =
        readJSON(
            this.predictionFile,
            []
        );



        history.push({

            time:
            new Date()
            .toISOString(),


            data

        });



        saveJSON(
            this.predictionFile,
            history
        );


        return true;

    }






    /**
     * 保存回测
     */
    static saveBacktest(
        data
    ){


        const history =
        readJSON(
            this.backtestFile,
            []
        );



        history.push({

            time:
            new Date()
            .toISOString(),


            data

        });



        saveJSON(
            this.backtestFile,
            history
        );


        return true;


    }





    /**
     * 获取预测历史
     */
    static getPredictions(){


        return readJSON(
            this.predictionFile,
            []
        );


    }





    /**
     * 获取回测历史
     */
    static getBacktests(){


        return readJSON(
            this.backtestFile,
            []
        );


    }





    /**
     * 统一接口输出
     */
    static format(
        result
    ){


        return {


            success:true,


            time:
            new Date()
            .toISOString(),



            result


        };


    }



}



export default OutputEngine;