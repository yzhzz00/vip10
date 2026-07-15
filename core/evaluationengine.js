// 大乐透AI_V90
// Evaluation Engine
// 回测评价引擎


window.EvaluationEngine = {


    history:[],


    results:[],


    initialized:false,







    // 初始化


    init(history=[]){


        this.history =
        history;


        this.results=[];


        this.initialized=true;



        console.log(
            "EvaluationEngine初始化完成"
        );



    },









    // 开始回测


    async backtest(
        predictor
    ){



        if(
            !this.history.length
        ){


            return {


                status:"failed",


                message:
                "没有历史数据"


            };


        }






        this.results=[];





        for(
            let i=50;
            i<this.history.length;
            i++
        ){



            let trainData =

            this.history.slice(
                0,
                i
            );



            let target =

            this.history[i];





            let prediction =

            await predictor(
                trainData
            );





            let score =

            this.compare(
                prediction,
                target
            );





            this.results.push({


                period:i,


                score,


                target,


                prediction



            });



        }





        return this.summary();



    },









    // 对比预测和开奖


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

            frontHit+backHit



        };



    },









    // 汇总


    summary(){



        let total=0;


        let count=0;



        let best=0;





        this.results.forEach(
            item=>{


                total +=

                item.score.total;



                count++;



                if(
                    item.score.total>best
                ){

                    best=
                    item.score.total;

                }



            }
        );





        return {


            periods:
            count,


            average:

            count
            ?
            (
                total/count
            ).toFixed(2)
            :
            0,



            best



        };



    },









    // 获取详细记录


    getResults(){


        return this.results;


    }




};