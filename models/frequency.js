// DLT-AI-CORE V11 FINAL
// models/frequency.js
// 历史频率模型


class FrequencyModel {


    constructor(){


        this.name =
        "frequency";


        this.history =
        [];


    }









    async train(history){


        this.history =
        history;



        return true;


    }









    async predict(features){


        const frequency =

        features.frequency
        ||
        {};



        return {


            front:

            this.top(
                frequency.front,
                10
            ),



            back:

            this.top(
                frequency.back,
                5
            )



        };


    }









    top(
        data,
        count
    ){


        if(
            !data
        ){


            return [];


        }



        return Object.entries(
            data
        )
        .sort(
            (a,b)=>

            b[1]-a[1]

        )
        .slice(
            0,
            count
        )
        .map(
            item=>

            Number(
                item[0]
            )

        );


    }









    score(number,type){


        const result =
        {};



        this.history
        .forEach(
            draw=>{


                draw[type]
                .forEach(
                    n=>{


                        result[n]=
                        (result[n]||0)+1;


                    }
                );


            }
        );



        return result[number]||0;


    }



}



export default FrequencyModel;