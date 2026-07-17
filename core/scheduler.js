// DLT-AI-CORE V11 FINAL
// core/scheduler.js
// 自动任务调度系统


class Scheduler {


    constructor(){


        this.jobs = [];


        this.running = false;


    }









    add(
        name,
        handler,
        interval
    ){


        this.jobs.push({


            name,


            handler,


            interval,


            lastRun:
            0



        });



    }









    async start(){


        if(
            this.running
        ){

            return;

        }



        this.running =
        true;



        while(
            this.running
        ){


            const now =
            Date.now();



            for(
                const job
                of this.jobs
            ){


                if(
                    now -
                    job.lastRun
                    >=
                    job.interval
                ){


                    try{


                        await job.handler();



                    }
                    catch(error){


                        console.error(
                            "Scheduler error:",
                            job.name,
                            error
                        );


                    }



                    job.lastRun =
                    now;


                }



            }



            // 防止CPU持续占用

            await this.sleep(
                1000
            );


        }



    }









    stop(){


        this.running =
        false;


    }









    sleep(ms){


        return new Promise(
            resolve =>
            setTimeout(
                resolve,
                ms
            )
        );


    }









    getJobs(){


        return this.jobs;


    }



}



export default Scheduler;