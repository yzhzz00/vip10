// DLT-AI-CORE V11 FINAL
// core/scheduler.js
// 分段计算调度模块
// 防止蒙特卡罗和回测任务卡死


import config from "../config.js";


class Scheduler {


    constructor(){


        this.running=false;


        this.progress=0;


        this.task=null;



    }









    async run(task,total,callback){



        if(
            this.running
        ){


            return {


                error:

                "任务正在运行"


            };


        }






        this.running=true;


        this.progress=0;






        const batch =

        config.compute.batchSize;






        let completed=0;






        try{



            while(
                completed<total
            ){



                const size =

                Math.min(

                    batch,

                    total-completed

                );






                await task(

                    size,

                    completed

                );






                completed += size;






                this.progress =


                Number(

                    (

                    completed/

                    total*

                    100

                    )

                    .toFixed(2)

                );






                if(callback){



                    callback(

                        this.progress

                    );


                }






                // 释放线程

                await this.sleep(10);



            }







            return {


                success:

                true,



                progress:

                100



            };





        }


        catch(error){



            return {


                success:

                false,



                error:

                error.message



            };



        }


        finally{


            this.running=false;



        }



    }









    getProgress(){



        return {


            running:

            this.running,



            progress:

            this.progress



        };


    }








    sleep(ms){


        return new Promise(

            resolve=>

            setTimeout(

                resolve,

                ms

            )

        );


    }






}



export default Scheduler;