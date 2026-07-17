// DLT-AI-CORE VIP
// models/frequency_model.js
//
// 频率模型
//
// 根据历史出现次数评分


class FrequencyModel {


    constructor(){


        this.front=[];


        this.back=[];


        this.history=[];


    }







    train(

        history

    ){



        this.history=

        history;



        let frontCount={};


        let backCount={};






        for(

            let i=1;

            i<=35;

            i++

        ){

            frontCount[i]=0;

        }






        for(

            let i=1;

            i<=12;

            i++

        ){

            backCount[i]=0;

        }








        history.forEach(item=>{



            item.front.forEach(num=>{



                frontCount[num]++;



            });







            item.back.forEach(num=>{



                backCount[num]++;



            });



        });








        let maxFront=

        Math.max(

            ...Object.values(frontCount)

        );







        let maxBack=

        Math.max(

            ...Object.values(backCount)

        );







        this.front=

        Object.keys(frontCount)

        .map(num=>({



            number:Number(num),



            score:

            Number(

                (

                frontCount[num]

                /

                maxFront

                *

                100

                )

                .toFixed(2)

            )



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );








        this.back=

        Object.keys(backCount)

        .map(num=>({



            number:Number(num),



            score:

            Number(

                (

                backCount[num]

                /

                maxBack

                *

                100

                )

                .toFixed(2)

            )



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );






        return true;


    }









    analyze(){



        return {



            front:this.front,



            back:this.back



        };


    }



}



export default new FrequencyModel();