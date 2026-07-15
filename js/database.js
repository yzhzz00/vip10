window.V110_DB={



    save(key,data){


        localStorage.setItem(

            key,

            JSON.stringify(data)

        );


    },







    get(key){



        let data=

        localStorage.getItem(key);



        return data

        ?

        JSON.parse(data)

        :

        [];



    },







    // 历史数据

    saveHistory(data){


        this.save(

            "V110_HISTORY",

            data

        );


    },





    getHistory(){


        return this.get(

            "V110_HISTORY"

        );


    },









    // AI会议记录

    saveConference(data){


        this.save(

            "V110_CONFERENCE",

            data

        );


    },







    getConference(){


        return this.get(

            "V110_CONFERENCE"

        );


    },









    // 训练考试记录

    saveTraining(data){


        this.save(

            "V110_TRAINING",

            data

        );


    },







    getTraining(){


        return this.get(

            "V110_TRAINING"

        );


    },









    // 开奖反馈

    saveFeedback(data){


        let old=

        this.get(

            "V110_FEEDBACK"

        );



        old.push(data);



        this.save(

            "V110_FEEDBACK",

            old

        );


    },







    getFeedback(){


        return this.get(

            "V110_FEEDBACK"

        );


    },









    // 模型权重

    saveWeights(data){


        this.save(

            "V110_WEIGHTS",

            data

        );


    },







    getWeights(){


        return this.get(

            "V110_WEIGHTS"

        );


    }





};