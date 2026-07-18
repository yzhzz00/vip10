/**
 * DLT-AI-CORE VIP
 * 特征工程
 */


import {
    frequency,
    hotNumbers,
    coldNumbers,
    omission,
    buildStatistics
} from "../utils/statistics.js";



class FeatureEngine {


    constructor(){

        this.features={};

    }




    /**
     * 主特征提取
     */
    extract(
        history=[]
    ){


        if(
            !history.length
        ){

            return {};

        }



        const fronts =
        history.map(
            item =>
            item.front
        );



        const backs =
        history.map(
            item =>
            item.back
        );



        const frontFlat =
        fronts.flat();



        const backFlat =
        backs.flat();




        const latest =
        history[
            history.length-1
        ];



        this.features={


            count:
            history.length,



            latest,



            frontFrequency:
            frequency(
                frontFlat
            ),



            backFrequency:
            frequency(
                backFlat
            ),



            frontHot:
            hotNumbers(
                frontFlat,
                10
            ),



            backHot:
            hotNumbers(
                backFlat,
                5
            ),



            frontCold:
            coldNumbers(
                frontFlat,
                10
            ),



            backCold:
            coldNumbers(
                backFlat,
                5
            ),




            frontOmission:
            omission(
                fronts,
                35
            ),



            backOmission:
            omission(
                backs,
                12
            ),




            recentTrend:
            this.trend(
                history
            ),



            structure:
            this.structure(
                fronts
            )


        };



        return this.features;


    }





    /**
     * 最近趋势
     */
    trend(
        history=[]
    ){


        const last50 =
        history.slice(-50);



        const numbers =
        last50
        .map(
            item =>
            item.front
        )
        .flat();



        return {


            hot:
            hotNumbers(
                numbers,
                10
            ),


            cold:
            coldNumbers(
                numbers,
                10
            )


        };


    }





    /**
     * 结构统计
     */
    structure(
        fronts=[]
    ){


        const result=[];



        fronts.forEach(
            front=>{


                result.push(
                    buildStatistics(
                        front
                    )
                );


            }
        );



        return {


            latest:
            result[
                result.length-1
            ],


            averageSum:

            this.average(
                result.map(
                    x=>x.sum
                )
            ),


            averageSpan:

            this.average(
                result.map(
                    x=>x.span
                )
            )


        };


    }





    average(
        arr=[]
    ){


        if(
            !arr.length
        ){

            return 0;

        }



        return (
            arr.reduce(
                (a,b)=>a+b,
                0
            )
            /
            arr.length
        );


    }





}


export default FeatureEngine;