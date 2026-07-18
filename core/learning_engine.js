/**
 * DLT-AI-CORE VIP
 *
 * Learning Engine V8.0 FINAL
 *
 * 功能:
 * 1. 开奖反馈学习
 * 2. 历史滚动记录
 * 3. 模型表现统计
 * 4. 动态权重竞争
 * 5. 数据持久化
 */


import StorageEngine from "./storage_engine.js";

import ModelCompetition from "./model_competition.js";





class LearningEngine {



    constructor(){



        this.storage =

        new StorageEngine();




        this.competition =

        new ModelCompetition();





        this.records=[];




        this.lastPrediction=null;





        this.models={



            statistics:{


                hit:0,


                total:0


            },



            bayesian:{


                hit:0,


                total:0


            },



            markov:{


                hit:0,


                total:0


            },



            matrix:{


                hit:0,


                total:0


            },



            structure:{


                hit:0,


                total:0


            },



            ensemble:{


                hit:0,


                total:0


            }



        };



    }









    /*
     * 保存预测结果
     */


    savePrediction(

        prediction

    ){



        this.lastPrediction =

        prediction;





        this.storage.savePrediction(

            prediction

        );





        return {


            status:

            "prediction_saved"



        };


    }









    /*
     * 提交开奖结果学习
     */


    async learn(

        feedback

    ){



        if(

            !this.lastPrediction

        ){



            return {


                status:

                "no_prediction"


            };


        }









        const result =

        this.compare(

            this.lastPrediction,

            feedback

        );








        const record={



            time:

            new Date(),



            prediction:

            this.lastPrediction,



            feedback,



            hit:

            result



        };









        this.records.push(

            record

        );







        this.storage.saveLearning(

            record

        );









        this.updateModels(

            result.score

        );









        /*
         * 模型竞争更新
         */


        const ranking =

        this.competition.update(

            result.score

        );









        return {



            status:

            "learning_completed",




            hit:

            result,



            total:

            this.records.length,



            models:

            this.models,



            competition:

            ranking



        };



    }









    /*
     * 命中计算
     */


    compare(

        prediction,

        feedback

    ){



        const frontHit =

        prediction.front.filter(

            n=>

            feedback.front.includes(n)

        ).length;








        const backHit =

        prediction.back.filter(

            n=>

            feedback.back.includes(n)

        ).length;









        return {



            frontHit,



            backHit,



            score:

            frontHit +

            backHit



        };



    }









    /*
     * 更新模型表现
     */


    updateModels(

        score

    ){



        Object.keys(

            this.models

        )

        .forEach(

            name=>{



                this.models[name].total++;






                if(

                    score>=3

                ){



                    this.models[name].hit++;



                }



            }



        );



    }









    /*
     * 获取学习状态
     */


    getStatus(){



        return {



            total:

            this.records.length,



            latest:

            this.records.slice(

                -20

            ),



            models:

            this.models,



            ranking:

            this.competition.ranking()



        };



    }









    /*
     * 获取动态权重
     */


    getWeights(){



        return this.competition.getWeights();



    }



}



export default LearningEngine;