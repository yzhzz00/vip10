/**
 * DLT-AI-CORE VIP
 * 大乐透结构模型
 */


import {
    buildStatistics
} from "../utils/statistics.js";



class StructureModel {


    constructor(){


        this.structures=[];


        this.history=[];


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



        this.structures =
        history.map(

            item=>
            buildStatistics(
                item.front
            )

        );



        return {


            name:
            "structure",


            numbers:
            this.rankNumbers()


        };


    }





    /**
     * 单号码结构评分
     */
    score(
        number
    ){


        let score=0;



        /*
         * 根据历史结构
         * 判断号码位置价值
         */


        this.history.forEach(

            item=>{


                if(
                    item.front
                    .includes(number)
                ){

                    score++;

                }


            }

        );



        return Number(

            (
            score /
            (
            this.history.length || 1
            )

            )

            .toFixed(4)

        );


    }





    /**
     * 排名
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
     * 判断结构匹配
     */
    match(
        numbers=[]
    ){


        const current =
        buildStatistics(
            numbers
        );



        let best=0;



        this.structures.forEach(

            item=>{


                let score=0;



                if(
                    item.oddEven.ratio
                    ===
                    current.oddEven.ratio
                ){

                    score++;

                }



                if(
                    item.bigSmall.ratio
                    ===
                    current.bigSmall.ratio
                ){

                    score++;

                }



                if(
                    item.zones.zone1
                    ===
                    current.zones.zone1
                ){

                    score++;

                }



                if(
                    item.zones.zone2
                    ===
                    current.zones.zone2
                ){

                    score++;

                }



                if(
                    item.zones.zone3
                    ===
                    current.zones.zone3
                ){

                    score++;

                }



                if(
                    score>best
                ){

                    best=score;

                }


            }

        );



        return Number(

            (
            best/5
            )

            .toFixed(4)

        );


    }





    /**
     * 状态
     */
    status(){


        return {


            type:
            "structure",


            samples:
            this.structures.length


        };


    }



}


export default StructureModel;