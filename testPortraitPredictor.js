const loadDLTData =
require("./core/dataLoader");


const buildPortrait =
require("./core/portraitBuilder");


const predictPortrait =
require("./portrait/portraitPredictor");



const history =
loadDLTData();



const portraits =
buildPortrait(history);



const result =
predictPortrait(
    portraits
);



console.log(result);