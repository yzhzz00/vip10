import {

loadDLT,

loadPL5

} from "./data.js";


import {

parseDLT,

splitArea

} from "../lottery/dlt.js";


import {

parsePL5,

splitPosition

} from "../lottery/pl5.js";


import {

dltFullPrediction,

pl5Prediction

} from "./prediction.js";





function runDLT(){


    const raw=

    loadDLT();



    const data=

    parseDLT(raw);



    const area=

    splitArea(data);



    return {


        lottery:
        "超级大乐透",


        periods:
        data.length,


        prediction:

        dltFullPrediction(

            area.front,

            area.back

        )


    };


}






function runPL5(){


    const raw=

    loadPL5();



    const data=

    parsePL5(raw);



    const position=

    splitPosition(data);



    return {


        lottery:
        "排列五",


        periods:
        data.length,


        prediction:

        pl5Prediction(
            position
        )


    };


}




export {

runDLT,

runPL5

};