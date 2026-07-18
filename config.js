/**
 * DLT-AI-CORE VIP
 * Config V1.0 FINAL
 */



export default {


    system:

    "DLT-AI-CORE VIP",



    version:

    "V1.0 FINAL",





    data:{


        history:

        "./data/dlt_history.txt",



        learning:

        "./data/learn_history.json",



        weights:

        "./data/model_weight.json",



        prediction:

        "./data/prediction_history.json",



        backtest:

        "./data/backtest_history.json"


    },






    model:{


        simulation:

        1000000,



        predictionCount:

        3,



        frontMax:

        35,



        backMax:

        12



    },






    backtest:{


        periods:[


            100,


            500,


            1000



        ]

    }





};