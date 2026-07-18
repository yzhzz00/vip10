const config = {

    version: "v21.5 mobile final",

    systemName: "dlt-ai-core",

    lottery: {

        default: "dlt",

        support: [
            "dlt",
            "pl5"
        ]

    },


    data: {

        dlt: "./data/dlt_history.txt",

        pl5: "./data/pl5_history.txt"

    },


    model: {

        bayesian: true,

        markov: true,

        montecarlo: true,

        genetic: true,

        agents: true,

        fusion: true

    },


    simulation: {

        monteCarloTimes: 100000

    },


    output: {

        topCount: 10

    }

};


export default config;