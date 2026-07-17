// DLT-AI-CORE VIP
// core/scheduler.js
// 分阶段任务调度模块
//
// 作用：
// 1. 控制分析流程
// 2. 返回实时进度
// 3. 防止一次性计算卡死
// 4. 支持网页进度条


class Scheduler {



    constructor(){


        this.progress = 0;


        this.status = "idle";


        this.steps=[];


    }









    // ======================
    // 开始任务
    // ======================

    start(){



        this.progress=0;


        this.status="running";


        this.steps=[];



    }









    // ======================
    // 更新进度
    // ======================

    update(percent,message){



        this.progress = percent;


        this.steps.push({



            percent,


            message,


            time:

            new Date()

            .toISOString()



        });



    }









    // ======================
    // 完成
    // ======================

    complete(){



        this.progress=100;


        this.status="complete";



    }









    // ======================
    // 获取状态
    // ======================

    getStatus(){



        return {



            progress:

            this.progress,



            status:

            this.status,



            steps:

            this.steps



        };



    }









    // ======================
    // 分片执行
    // ======================

    async run(tasks,callback){



        this.start();







        const total=

        tasks.length;







        for(

            let i=0;

            i<total;

            i++

        ){



            const task=

            tasks[i];







            this.update(

                Math.floor(

                    (

                        i/

                        total

                    )

                    *

                    100

                ),

                task.name

            );







            await task.run();






            // 释放事件循环

            await new Promise(

                resolve=>

                setTimeout(

                    resolve,

                    10

                )

            );



        }







        this.complete();







        if(callback){



            callback(

                this.getStatus()

            );



        }







        return this.getStatus();



    }





}



export default Scheduler;