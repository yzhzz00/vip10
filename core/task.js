// DLT-AI-CORE V11 FINAL
// core/task.js
// 后台任务管理 / 防手机卡死


class TaskManager {


    constructor(){


        this.tasks =
        {};


        this.id =
        0;


    }









    create(
        name,
        handler,
        options={}
    ){


        const id =
        ++this.id;



        this.tasks[id] = {


            id,


            name,


            status:
            "waiting",


            progress:
            0,


            result:
            null,


            error:
            null



        };



        this.run(
            id,
            handler,
            options
        );



        return id;


    }









    async run(
        id,
        handler,
        options
    ){


        const task =
        this.tasks[id];



        try{


            task.status =
            "running";



            const result =
            await handler(
                this.progress.bind(
                    this,
                    id
                ),
                options
            );



            task.result =
            result;


            task.progress =
            100;


            task.status =
            "completed";



        }
        catch(error){


            task.error =
            error.message;


            task.status =
            "failed";


        }


    }









    progress(
        id,
        value
    ){


        if(
            this.tasks[id]
        ){


            this.tasks[id]
            .progress =
            Math.min(
                100,
                Math.max(
                    0,
                    value
                )
            );


        }


    }









    get(id){


        return (
            this.tasks[id]
            ||
            null
        );


    }









    getAll(){


        return this.tasks;


    }









    clear(id){


        delete this.tasks[id];


    }



}



export default TaskManager;