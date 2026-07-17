// DLT-AI-CORE V11 FINAL
// core/scheduler.js
// 分段计算调度系统
// 防止计算卡死
// 管理任务进度


import config from "../config.js";


class Scheduler {


    constructor(){


        this.tasks = {};


        this.current = null;


    }





    createTask(name,total){


        const id =

        Date.now().toString();



        this.tasks[id]={


            id,


            name,


            total,


            current:0,


            progress:0,


            status:"running",


            startTime:

            new Date()


        };



        this.current=id;



        return id;


    }





    update(id,count){


        const task =

        this.tasks[id];



        if(!task){

            return null;

        }



        task.current += count;



        if(
            task.current >
            task.total
        ){

            task.current =
            task.total;

        }



        task.progress =

        Number(

            (

                task.current /

                task.total

                *

                100

            )

            .toFixed(2)

        );



        return task;


    }





    finish(id,result=null){


        const task =

        this.tasks[id];



        if(!task){

            return null;

        }



        task.current =
        task.total;


        task.progress =
        100;


        task.status =
        "completed";


        task.result =
        result;



        task.endTime =
        new Date();



        return task;


    }





    fail(id,error){


        const task =

        this.tasks[id];



        if(!task){

            return null;

        }



        task.status =
        "failed";


        task.error =
        error.message
        ||
        String(error);



        task.endTime =
        new Date();



        return task;


    }





    get(id){


        return this.tasks[id]
        ||
        null;


    }





    getCurrent(){


        if(!this.current){

            return null;

        }



        return this.tasks[
            this.current
        ];


    }





    // 分批执行函数

    async runBatch(options){


        const {


            name,

            total,

            batchSize,

            handler


        } = options;



        const id =

        this.createTask(
            name,
            total
        );



        try{


            let completed = 0;



            while(
                completed < total
            ){


                const size =

                Math.min(

                    batchSize,

                    total-completed

                );



                await handler(
                    size,
                    completed
                );



                completed += size;



                this.update(
                    id,
                    size
                );



            }



            return this.finish(id);



        }

        catch(error){


            return this.fail(
                id,
                error
            );


        }



    }



}



export default Scheduler;