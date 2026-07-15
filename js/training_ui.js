// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// training_engine.js
// AI历史滚动训练中心
// ==================================================

"use strict";


window.V100TrainingEngine = {



    running:false,


    windowSize:500,


    records:[],





    async start(){



        if(this.running){

            return;

        }



        let history=

        V100Database.get();





        if(
            history.length<=this.windowSize
        ){

            alert(
            "历史数据不足500期"
            );

            return;

        }





        this.running=true;


        this.records=[];





        let total=

        history.length-

        this.windowSize;





        V100Progress.start(

            "AI历史滚动考试",

            total

        );








        for(

            let i=this.windowSize;

            i<history.length;

            i++

        ){



            if(
                !this.running
            ){

                break;

            }






            // 前500期训练数据


            let trainHistory=

            history.slice(

                i-this.windowSize,

                i

            );







            // 下一期开奖


            let real=

            history[i];









            // AI预测


            let result=

            await V100Predictor.analyze(

                trainHistory

            );







            // 比较结果


            let compare=

            this.compare(

                result.final,

                real

            );







            this.records.push({


                period:

                real.period,


                predict:

                result.final,


                real,


                compare



            });








            // 学习


            if(
                window.V100Learning
            ){



                V100Learning.learn({


                    result:


                    {


                        front:

                        compare.front,


                        back:

                        compare.back



                    }


                });



            }







            V100Progress.update(

                i-this.windowSize+1

            );








            // 给手机释放CPU


            await this.sleep(30);



        }






        this.running=false;




        this.saveReport();




        V100Progress.finish();





        if(
            window.V100Report
        ){

            V100Report.render();

        }





        console.log(

            "训练完成"

        );



    },









    compare(

        predict,

        real

    ){



        let frontHit=

        predict.front.filter(

            n=>

            real.front.includes(n)

        );





        let backHit=

        predict.back.filter(

            n=>

            real.back.includes(n)

        );






        return {


            front:

            frontHit.length,



            back:

            backHit.length



        };



    },









    saveReport(){



        let report={


            time:

            new Date()
            .toLocaleString(),



            total:

            this.records.length,



            front3:

            this.records.filter(

                x=>

                x.compare.front>=3

            ).length,



            front2:

            this.records.filter(

                x=>

                x.compare.front>=2

            ).length,



            back2:

            this.records.filter(

                x=>

                x.compare.back===2

            ).length,



            records:

            this.records



        };






        localStorage.setItem(

            "V100_TRAIN_REPORT",

            JSON.stringify(

                report

            )

        );



    },









    stop(){


        this.running=false;


    },









    sleep(ms){


        return new Promise(

            r=>

            setTimeout(

                r,

                ms

            )

        );


    }





};