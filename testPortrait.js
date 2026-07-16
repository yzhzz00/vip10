const loadDLTData =
require("./core/dataLoader");


const buildPortrait =
require("./core/portraitBuilder");



const history =
loadDLTData();



const portrait =
buildPortrait(history);



console.log(
    portrait[0]
);