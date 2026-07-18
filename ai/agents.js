function probabilityAgent(score){


    return {

        name:"probability",

        result:score

    };


}



function trendAgent(markov){


    return {

        name:"trend",

        result:markov

    };


}



function structureAgent(feature){


    return {

        name:"structure",

        result:feature

    };


}



function riskAgent(data){


    return {

        name:"risk",

        result:data.length

    };


}



function judge(agents){


    return {

        agents:agents.length,

        status:"completed",

        confidence:

        Math.min(
            95,
            60+agents.length*5
        )


    };


}



export {

    probabilityAgent,

    trendAgent,

    structureAgent,

    riskAgent,

    judge

};