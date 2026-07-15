// 大乐透AI_V90
// Learning Engine
// AI反馈学习引擎


window.LearningEngine = {


    memory:[],


    weights:{},


    initialized:false,






    // 初始化


    init(
        weights={}
    ){


        this.weights = {


            ...weights


        };



        this.memory=[];



        this.initialized=true;



        console.log(
            "LearningEngine初始化完成"
        );


    },









    // 接收开奖反馈


    feedback(
        prediction,
        actual
    ){



        let analysis =

        this.compare(
            prediction,
            actual
        );





        let update =

        this.selfCorrection(
            analysis
        );





        this.memory.push({


            time:

            new Date()
            .toISOString(),



            prediction,


            actual,


            analysis,


            update



        });





        return update;



    },









    // 比较预测与开奖


    compare(
        prediction,
        actual
    ){



        let frontHit=0;


        let backHit=0;




        prediction.front.forEach(
            n=>{


                if(
                    actual.front.includes(n)
                ){


                    frontHit++;


                }


            }
        );





        prediction.back.forEach(
            n=>{


                if(
                    actual.back.includes(n)
                ){


                    backHit++;


                }


            }
        );






        return {


            frontHit,


            backHit,


            total:

            frontHit+
            backHit



        };



    },









    // AI自我修正


    selfCorrection(
        result
    ){



        let change={};





        /*
        
        命中低：

        降低过度依赖模型

        命中高：

        保留当前权重


        */


        if(
            result.total<=1
        ){



            change={


                status:
                "模型需要修正",



                action:
                "降低当前预测权重"



            };




            this.reduceWeight();



        }






        else if(
            result.total>=4
        ){



            change={


                status:
                "模型表现良好",



                action:
                "保持当前权重"



            };



        }





        else{



            change={


                status:
                "正常波动",


                action:
                "微调"



            };



            this.smallAdjust();



        }





        return change;



    },









    // 降低权重


    reduceWeight(){



        for(
            let key in this.weights
        ){



            this.weights[key]*=0.95;



        }




        this.normalize();



    },









    // 微调


    smallAdjust(){



        for(
            let key in this.weights
        ){



            this.weights[key]*=
            (
                0.99+
                Math.random()*0.02
            );


        }



        this.normalize();



    },









    // 权重归一化


    normalize(){



        let sum=0;



        for(
            let key in this.weights
        ){


            sum +=
            this.weights[key];


        }




        if(sum===0){

            return;

        }




        for(
            let key in this.weights
        ){


            this.weights[key]
            =
            this.weights[key]
            /
            sum;


        }



    },









    // 获取当前模型


    getModel(){



        return {


            weights:
            this.weights,


            memory:
            this.memory



        };



    }





};