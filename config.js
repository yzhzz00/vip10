// DLT-AI-CORE V11 FINAL
// config.js
// 全局系统配置


const config = {


    system: {


        name:

        "DLT-AI-CORE",


        version:

        "V11 FINAL",


        game:

        "大乐透"



    },





    data: {


        file:

        "./data/dlt_history.txt",



        frontCount:

        5,



        backCount:

        2,



        frontMax:

        35,



        backMax:

        12



    },







    models: {


        frequency: {


            enabled:

            true,


            weight:

            1.0


        },



        trend: {


            enabled:

            true,


            weight:

            0.9


        },



        bayes: {


            enabled:

            true,


            weight:

            1.0


        },



        markov: {


            enabled:

            true,


            weight:

            0.9


        },



        montecarlo: {


            enabled:

            true,


            weight:

            0.8



        }



    },








    theory: {


        zone: {


            one:

            [1,12],



            two:

            [13,24],



            three:

            [25,35]



        },



        sumRange:


        [50,160],



        maxConsecutive:

        3



    },








    ai: {


        committee:


        true,



        learning:


        true,



        feedback:


        true



    },








    compute: {


        batchSize:

        200,



        montecarloTimes:

        100000,



        cache:


        true



    }






};





export default config;