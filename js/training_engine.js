// ==================================================
// 大乐透 AI V100 CORE FINAL
// training_engine.js
// 滚动窗口真实考试训练引擎
// ==================================================

"use strict";


window.V100TrainingEngine = {


    windowSize:500,

    records:[],


    running:false,

    current:0,


    // ==========================
    // 初始化
    // ==========================

    init(){

        let save = localStorage.getItem(
            "V100_TRAIN_RECORD"
        );


        if(save){

            this.records = JSON.parse(save);

        }


    },



    // ==========================
    // 开始训练
    // ==========================

    async start(){


        if(this.running){

            return;

        }


        this.running=true;


        let history = V100Database.get();


        if(history.length <= this.windowSize){


            alert("历史数据不足");


            return;

        }



        let total =
        history.length-this.windowSize;



        this.current=0;



        for(
            let i=this.windowSize;

            i<history.length;

            i++

        ){


            if(!this.running){

                break;

            }



            let trainData =
            history.slice(
                i-this.windowSize,
                i
            );



            let real =
            history[i];



            // AI预测

            let prediction =
            await this.predict(
                trainData
            );



            // 比较结果

            let result =
            this.compare(
                prediction,
                real
            );



            let record={


                round:
                i-this.windowSize+1,


                predict:prediction,


                real:real,


                result:result,


                time:
                Date.now()


            };



            this.records.push(record);



            this.save();



            this.current++;



            // 更新界面

            if(window.V100TrainingUI){


                V100TrainingUI.update(
                    this.current,
                    total,
                    record
                );


            }



            // 释放手机线程

            await this.sleep(30);



        }



        this.running=false;



        console.log(
            "训练完成",
            this.records.length
        );


    },





    // ==========================
    // 单次预测
    // ==========================


    async predict(data){


        /*
        
        这里调用正式预测核心

        注意：

        训练模型和正式模型分开
        
        */


        return await V100Predictor.analyze(
            data,
            true
        );


    },





    // ==========================
    // 命中比较
    // ==========================


    compare(pred,real){



        let frontHit =
        pred.front.filter(

            x=>
            real.front.includes(x)

        );



        let backHit =
        pred.back.filter(

            x=>
            real.back.includes(x)

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
    // 保存记录
    // ==========================


    save(){


        localStorage.setItem(

            "V100_TRAIN_RECORD",

            JSON.stringify(
                this.records
            )

        );


    },






    // ==========================
    // 停止训练
    // ==========================


    stop(){


        this.running=false;


    },






    // ==========================
    // 清空记录
    // ==========================


    clear(){


        this.records=[];


        localStorage.removeItem(
            "V100_TRAIN_RECORD"
        );


    },






    sleep(ms){


        return new Promise(

            resolve=>
            setTimeout(
                resolve,
                ms
            )

        );


    }





};



// 自动初始化

document.addEventListener(

"DOMContentLoaded",

()=>{


    V100TrainingEngine.init();


});