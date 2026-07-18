/**
 * DLT-AI-CORE VIP
 * 反馈学习引擎
 */


import {
    readJSON,
    saveJSON
} from "../utils/helper.js";


class LearningEngine {


    constructor(){


        this.file =
        "./data/learn_history.json";


        this.history =
        readJSON(
            this.file,
            []
        );


    }





    /**
     * 接收开奖结果反馈
     *
     * data格式:
     *
     * {
     * issue:"26078",
     * front:[1,2,3,4,5],
     * back:[1,2]
     * }
     *
     */
    async update(
        data,
        models={}
    ){


        if(
            !data
            ||
            !data.front
            ||
            !data.back
        ){

            throw new Error(
                "开奖数据格式错误"
            );

        }




        const record = {


            time:
            new Date()
            .toISOString(),



            issue:
            data.issue || "",



            front:
            data.front.map(
                Number
            ),



            back:
            data.back.map(
                Number
            ),



            modelResult:
            models



        };



        this.history.push(
            record
        );



        saveJSON(
            this.file,
            this.history
        );



        return {


            success:true,


            message:
            "反馈学习完成",


            totalLearning:
            this.history.length


        };


    }





    /**
     * 单数字输入模式
     *
     * 前区:
     * [6,8,23,26,27]
     *
     * 后区:
     * [5,12]
     */
    parseInput(
        frontInput,
        backInput
    ){


        return {


            front:

            String(frontInput)
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number),



            back:

            String(backInput)
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number)


        };


    }





    /**
     * 获取学习状态
     */
    status(){


        return {


            count:
            this.history.length,


            latest:
            this.history[
                this.history.length-1
            ] || null


        };


    }





    /**
     * 获取全部学习记录
     */
    getHistory(){

        return this.history;

    }



}


export default LearningEngine;