/**
 * DLT-AI-CORE VIP
 * 统计模型
 */


import {
    frequency,
    omission
} from "../utils/statistics.js";



class StatisticsModel {


    constructor(){


        this.frequency = {};

        this.omission = {};

        this.history = [];


    }





    /**
     * 训练
     */
    train(
        history=[],
        features={}
    ){


        this.history =
        history;



        const frontNumbers =
        history
        .map(
            item=>item.front
        )
        .flat();




        this.frequency =
        frequency(
            frontNumbers
        );



        this.omission =
        omission(
            history.map(
                item=>item.front
            ),
            35
        );



        return {


            name:
            "statistics",



            numbers:
            this.rankNumbers()



        };


    }





    /**
     * 单号码评分
     */
    score(
        number
    ){


        const freq =
        this.frequency[number]
        ||
        0;



        const omit =
        this.omission[number]
        ||
        0;



        /*
         * 频率占70%
         * 遗漏占30%
         */

        return Number(

            (

            freq * 0.7

            +

            omit * 0.3

            )

            .toFixed(4)

        );


    }





    /**
     * 号码排序
     */
    rankNumbers(){


        const result=[];



        for(
            let i=1;
            i<=35;
            i++
        ){


            result.push({

                number:i,


                score:
                this.score(i)


            });


        }



        return result.sort(

            (a,b)=>
            b.score-a.score

        );


    }





    /**
     * 获取热门号码
     */
    hot(){

        return this.rankNumbers()
        .slice(0,10);

    }





    /**
     * 获取模型状态
     */
    status(){


        return {


            historyCount:
            this.history.length,


            type:
            "statistics"


        };


    }



}



export default StatisticsModel;