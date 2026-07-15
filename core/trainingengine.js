// 大乐透AI_V90
// Training Engine
// 模型训练与权重调整引擎


window.TrainingEngine = {


    history: [],


    weights:{},


    feedback: [],


    trained:false,






    // 初始化


    init(config={}){


        this.weights = {


            feature:
            0.20,


            theory:
            0.20,


            markov:
            0.20,


            bayes:
            0.15,


            montecarlo:
            0.25


        };



        if(config.weights){


            this.weights =
            config.weights;


        }



        console.log(
            "TrainingEngine初始化完成"
        );


    },









    // 加载训练数据


    loadData(
        history=[],
        feedback=[]
    ){


        this.history =
        history;


        this.feedback =
        feedback;


    },









    // 开始训练


    async train(){



        if(
            this.history.length===0
        ){


            return {


                status:"failed",

                message:
                "没有训练数据"


            };


        }





        let score =

        this.evaluateHistory();





        this.adjustWeights(
            score
        );





        this.trained=true;



        return {


            status:"complete",


            weights:
            this.weights



        };


    },









    // 历史评价


    evaluateHistory(){



        let result={


            feature:0,

            theory:0,

            markov:0,

            bayes:0,

            montecarlo:0


        };





        /*
        
        后续接入：

        回测命中情况

        不同模型贡献度

        */


        this.history.forEach(
            item=>{


                if(
                    item.front
                ){

                    result.feature +=1;


                }


            }
        );




        return result;



    },









    // 权重调整


    adjustWeights(
        score
    ){



        let total=0;



        for(
            let k in score
        ){


            total += score[k];


        }



        if(total===0){

            return;

        }




        for(
            let k in score
        ){


            this.weights[k] =

            score[k]
            /
            total;



        }



    },









    // 接收开奖反馈


    addFeedback(
        data
    ){


        this.feedback.push(
            data
        );


    },









    // 导出模型权重


    getWeights(){


        return this.weights;


    },









    // 保存状态接口


    export(){


        return {


            weights:
            this.weights,


            feedback:
            this.feedback,


            trained:
            this.trained



        };


    }



};