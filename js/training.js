window.V110_TRAINING={





records:[],






// =====================
// 滚动考试
// =====================


run(history){



    let result=[];



    let windowSize=

    V110_CONFIG.trainWindow;





    for(
        let i=windowSize;
        i<history.length;
        i++
    ){





        let trainData=

        history.slice(

            i-windowSize,

            i

        );






        let real=

        history[i];







        let predict=

        V110_PREDICTOR.predict(

            trainData

        );






        let hitFront=

        predict.best.front.filter(

            n=>

            real.front.includes(n)

        ).length;







        let hitBack=

        predict.best.back.filter(

            n=>

            real.back.includes(n)

        ).length;









        result.push({



            period:

            real.period,



            predict:

            predict.best,



            real,



            hit:{


                front:hitFront,


                back:hitBack


            },



            confidence:

            predict.confidence,



            conference:

            predict.conference



        });





    }






    this.records=result;






    V110_DB.saveTraining(

        result

    );






    return result;



},









// =====================
// 成绩统计
// =====================


statistics(range){



    let data=

    V110_DB.getTraining();





    let list=

    data.slice(

        -range

    );






    if(
        list.length===0
    ){

        return null;

    }






    let front=0;

    let back=0;






    list.forEach(item=>{



        front+=

        item.hit.front;



        back+=

        item.hit.back;



    });







    return {



        total:

        list.length,



        avgFront:

        (

        front/list.length

        ).toFixed(2),




        avgBack:

        (

        back/list.length

        ).toFixed(2)



    };



},









// =====================
// 成长报告
// =====================


report(){



    return {



        last100:

        this.statistics(100),




        last500:

        this.statistics(500),




        last1000:

        this.statistics(1000)



    };



}







};