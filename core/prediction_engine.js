/**
 * DLT-AI-CORE VIP
 * Prediction Engine V2.0
 *
 * 模型驱动预测
 */


class PredictionEngine {


    constructor(
        modelResult={}
    ){

        this.models =
        modelResult.models
        ||
        modelResult
        ||
        {};

    }





    async predict(){


        const frontPool =
        this.buildFrontPool();



        const backPool =
        this.buildBackPool();



        const predictions =
        this.generateCombination(

            frontPool,

            backPool

        );



        return {


            time:
            new Date()
            .toISOString(),


            engine:
            "prediction_v2",


            predictions



        };


    }






    /**
     * 前区候选池
     */
    buildFrontPool(){


        const scoreMap={};



        for(
            let i=1;
            i<=35;
            i++
        ){

            scoreMap[i]=0;

        }





        Object.keys(
            this.models
        )
        .forEach(
            model=>{


                const data =
                this.models[model];



                if(
                    !data
                    ||
                    !data.numbers
                ){

                    return;

                }



                data.numbers
                .forEach(
                    item=>{


                        scoreMap[item.number]
                        +=