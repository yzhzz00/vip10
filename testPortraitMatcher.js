const loadDLTData =
require("./core/dataLoader");


const buildPortrait =
require("./core/portraitBuilder");


const predictPortrait =
require("./portrait/portraitPredictor");


const matchPortrait =
require("./portrait/portraitMatcher");



const history =
loadDLTData();



const portraits =
buildPortrait(history);



const prediction =
predictPortrait(
    portraits
);



const matches =
matchPortrait(
    portraits,
    prediction.prediction
);



console.log(
    matches
);