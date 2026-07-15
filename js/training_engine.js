// ==================================================
// 大乐透 AI V100.1 CORE FINAL
// training_engine.js
// 历史滚动考试训练系统
// ==================================================

"use strict";


window.V100TrainingEngine = {



    running:false,


    current:0,


    total:0,


    records:[],







    // ==========================
    // 开始训练
    // ==========================


    async start(){



        if(
            this.running
        ){

            return;

        }




        let history =

        V100Database.get();





        let windowSize=500;



        if(
            history.length<=windowSize
        ){


            alert(
            "数据不足500期"
            );


            return;


        }





        this.running=true;



        this.current=0;


        this.records=[];




        this.total=

        history.length-windowSize;





        V100Progress.start(

            "AI历史滚动考试",

            this.total

        );







        for(

            let i=windowSize;

            i<history.length;

            i++

        ){



            if(
                !this.running
            ){

                break;

            }






            let trainData=

            history.slice(

                i-windowSize,

                i

            );







            let real=

            history[i];








            // 使用新版预测


            let prediction=

            await V100Predictor.analyze(

                trainData

            );







            let result=

            this.compare(

                prediction.final,

                real

            );







            this.records.push({


                period:

                real.period,


                predict:

                prediction.final,


                real,


                result



            });








            // 学习


            if(
                window.V100Learning
            ){


                V100Learning.learn({

                    result

                });


            }








            this.current++;



            V100Progress.update(

                this.current

            );




            this.updateUI(

                result

            );






            // 释放手机性能


            await this.sleep(20);



        }






        this.running=false;



        V100Progress.finish();




        this.report();



    },









    // ==========================
    // 对比开奖
    // ==========================


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

            backHit.length,



            total:

            frontHit.length+

            backHit.length



        };



    },









    // ==========================
    // 训练报告
    // ==========================


    report(){



        let front3=0;

        let front2=0;

        let front1=0;

        let back2=0;

        let back1=0;




        this.records.forEach(r=>{



            if(
                r.result.front>=3
            ){

                front3++;

            }


            if(
                r.result.front>=2
            ){

                front2++;

            }



            if(
                r.result.front>=1
            ){

                front1++;

            }



            if(
                r.result.back===2
            ){

                back2++;

            }



            if(
                r.result.back>=1
            ){

                back1++;

            }



        });






        let report={


            total:

            this.records.length,


            front3,


            front2,


            front1,


            back2,


            back1



        };






        localStorage.setItem(

            "V100_TRAIN_REPORT",

            JSON.stringify(
                report
            )

        );





        console.log(
            report
        );



        return report;



    },









    // ==========================
    // 停止
    // ==========================


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


    },









    updateUI(result){



        let box=

        document.getElementById(
            "trainDetail"
        );



        if(box){


            box.innerHTML=

            `

            当前考试：

            ${this.current}

            /

            ${this.total}


            <br>


            本次命中：

            前区${result.front}

            后区${result.back}

            `;


        }



    }





};