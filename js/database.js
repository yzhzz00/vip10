window.V110_DB = {



    keyHistory:
    "V110_HISTORY",



    keyTrain:
    "V110_TRAIN",



    keyFeedback:
    "V110_FEEDBACK",



    keyModel:
    "V110_MODEL",







    // 保存历史数据

    saveHistory(data){


        localStorage.setItem(

            this.keyHistory,

            JSON.stringify(data)

        );


    },







    // 读取历史数据

    getHistory(){



        let data =

        localStorage.getItem(

            this.keyHistory

        );



        if(data){


            return JSON.parse(data);


        }



        return [];


    },









    // 保存训练结果

    saveTrain(data){



        localStorage.setItem(

            this.keyTrain,

            JSON.stringify(data)

        );


    },







    // 读取训练结果

    getTrain(){



        let data=

        localStorage.getItem(

            this.keyTrain

        );



        return data ?

        JSON.parse(data)

        :

        [];



    },









    // 保存开奖反馈

    saveFeedback(data){



        let old=

        this.getFeedback();



        old.push(data);



        localStorage.setItem(

            this.keyFeedback,

            JSON.stringify(old)

        );



    },








    // 读取反馈

    getFeedback(){



        let data=

        localStorage.getItem(

            this.keyFeedback

        );



        return data ?

        JSON.parse(data)

        :

        [];



    },









    // 保存模型状态

    saveModel(data){



        localStorage.setItem(

            this.keyModel,

            JSON.stringify(data)

        );


    },









    // 读取模型状态

    getModel(){



        let data=

        localStorage.getItem(

            this.keyModel

        );



        return data ?

        JSON.parse(data)

        :

        {

            version:"V110",

            trained:0

        };



    }





};