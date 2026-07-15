// ==================================================
// V100.1 模型状态保存
// ==================================================

"use strict";


window.V100ModelState = {



    key:

    "V100_MODEL_STATE",







    save(){



        let state={



            version:

            V100Model.version,



            time:

            new Date()
            .toLocaleString(),




            weights:


            window.V100Learning

            ?

            V100Learning.getWeights()

            :

            {}



        };






        localStorage.setItem(


            this.key,


            JSON.stringify(state)


        );



    },









    get(){



        let data =

        localStorage.getItem(

            this.key

        );





        return data

        ?

        JSON.parse(data)

        :

        {

            version:"V100.1",

            weights:{}

        };



    },









    clear(){



        localStorage.removeItem(

            this.key

        );



    }





};