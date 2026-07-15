window.DLT_DATABASE = {



    keys:{


        weights:"DLT_MODEL_WEIGHTS",


        train:"DLT_TRAIN_RECORD",


        feedback:"DLT_FEEDBACK_RECORD",


        report:"DLT_AI_REPORT"


    },







    // 保存模型权重

    saveWeights(data){


        localStorage.setItem(


            this.keys.weights,


            JSON.stringify(data)


        );


    },







    // 获取模型权重

    getWeights(){



        let data = localStorage.getItem(


            this.keys.weights


        );



        if(data){


            return JSON.parse(data);


        }



        return DLT_CONFIG.modelWeights;



    },









    // 保存训练记录

    saveTrainRecord(record){



        let old = this.getTrainRecord();



        old.push(record);



        localStorage.setItem(


            this.keys.train,


            JSON.stringify(old)


        );



    },









    // 获取训练记录

    getTrainRecord(){



        let data = localStorage.getItem(


            this.keys.train


        );



        return data ?


        JSON.parse(data)


        :


        [];



    },









    // 清空训练记录

    clearTrainRecord(){



        localStorage.removeItem(


            this.keys.train


        );


    },









    // 保存开奖反馈

    saveFeedback(data){



        let old = this.getFeedback();



        old.push(data);



        localStorage.setItem(


            this.keys.feedback,


            JSON.stringify(old)


        );



    },









    // 获取反馈数据

    getFeedback(){



        let data = localStorage.getItem(


            this.keys.feedback


        );



        return data ?


        JSON.parse(data)


        :


        [];



    },









    // 保存成长报告

    saveReport(data){



        localStorage.setItem(


            this.keys.report,


            JSON.stringify(data)


        );


    },









    // 获取成长报告

    getReport(){



        let data = localStorage.getItem(


            this.keys.report


        );



        return data ?


        JSON.parse(data)


        :


        null;



    }






};