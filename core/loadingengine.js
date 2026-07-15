// 大乐透AI_V90
// Loading Engine
// 负责任务进度与分段计算状态


window.LoadingEngine = {


    progress:0,


    currentTask:"等待任务",


    status:"idle",



    // 初始化

    init(){


        this.progress = 0;

        this.currentTask =
        "系统准备";

        this.status =
        "ready";


        this.updateUI();


    },





    // 开始任务


    start(task){


        this.status =
        "running";


        this.currentTask =
        task;


        this.setProgress(
            0,
            task
        );


    },







    // 更新进度


    setProgress(
        percent,
        task
    ){


        this.progress =
        percent;


        if(task){

            this.currentTask =
            task;

        }



        this.updateUI();


    },








    // 增加进度


    addProgress(
        value,
        task
    ){



        let next =
        this.progress + value;



        if(next>100){

            next=100;

        }



        this.setProgress(
            next,
            task
        );



    },








    // 完成任务


    finish(task){


        this.progress =
        100;


        this.status =
        "complete";



        if(task){

            this.currentTask =
            task;

        }else{


            this.currentTask =
            "任务完成";


        }



        this.updateUI();



    },







    // 分段等待

    async sleep(ms){


        return new Promise(
            resolve =>
            setTimeout(
                resolve,
                ms
            )
        );


    },








    // 执行分段任务


    async runChunk(
        total,
        batch,
        callback,
        name
    ){



        let completed = 0;



        this.start(
            name
        );



        while(
            completed < total
        ){



            let current =
            Math.min(
                batch,
                total-completed
            );



            await callback(
                current,
                completed
            );



            completed += current;



            let percent =
            Math.floor(
                completed /
                total *
                100
            );



            this.setProgress(
                percent,
                name+
                " "+
                completed+
                "/"+
                total
            );



            // 给手机浏览器释放时间

            await this.sleep(20);



        }



        this.finish(
            name+"完成"
        );


    },









    // 更新页面


    updateUI(){


        if(window.UI){


            window.UI.updateProgress(
                this.progress,
                this.currentTask
            );


        }


    }




};