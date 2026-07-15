window.V110_LEARNING = {



    records:[],





    // =========================
    // 历史滚动训练
    // =========================

    async train(history){



        let result=[];



        let size =
        V110_CONFIG.trainWindow;



        if(history.length<=size){


            return {

                message:
                "历史数据不足"


            };


        }





        for(
            let i=size;
            i<history.length;
            i++
        ){



            let trainData =

            history.slice(
                i-size,
                i
            );



            let real =

            history[i];





            let prediction =

            await V110_PREDICTOR.predict(
                trainData
            );





            let hitFront =

            prediction.best.front.filter(

                n=>

                real.front.includes(n)

            ).length;





            let hitBack =

            prediction.best.back.filter(

                n=>

                real.back.includes(n)

            ).length;







            result.push({


                period:
                real.period,


                predict:
                prediction.best,


                real,


                hit:{

                    front:hitFront,

                    back:hitBack

                }



            });





            if(
                window.V110_UI
            ){


                V110_UI.progress(

                    i-size,

                    history.length-size

                );


            }






            // 防止手机卡

            await new Promise(

                r=>

                setTimeout(
                    r,
                    30
                )

            );



        }







        this.records=result;




        localStorage.setItem(

            "V110_TRAIN_RECORD",

            JSON.stringify(result)

        );





        return result;



    },









    // =========================
    // 开奖反馈
    // =========================

    saveFeedback(data){



        let list =

        JSON.parse(

            localStorage.getItem(
                "V110_FEEDBACK"
            )

            ||

            "[]"

        );



        list.push(data);



        localStorage.setItem(

            "V110_FEEDBACK",

            JSON.stringify(list)

        );



        return true;



    },









    // =========================
    // 模型成长评分
    // =========================

    report(){



        let data =

        JSON.parse(

            localStorage.getItem(
                "V110_TRAIN_RECORD"
            )

            ||

            "[]"

        );





        if(
            data.length===0
        ){


            return {

                total:0,

                hit:0,

                rate:0


            };


        }






        let hit =

        data.filter(

            x=>

            x.hit.front>=3

        ).length;







        return {



            total:data.length,


            hit,


            rate:

            (

                hit/data.length*100

            )

            .toFixed(2)



        };



    }







};