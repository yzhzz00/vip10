window.V110_ENGINE={



history:[],


result:null,






async init(){



let res=

await fetch(

V110_CONFIG.dataFile

);



let text=

await res.text();




this.history=

V110_PARSER.parse(text);




V110_DB.save(

"V110_HISTORY",

this.history

);





V110_UI.refreshData();



},







analyze(){



this.result=

V110_PREDICTOR.predict(

this.history

);



V110_UI.showPrediction(

this.result

);



},








train(){



let data=

V110_TRAINING.run(

this.history

);



V110_UI.showTraining(

data

);



},








report(){



let r=

V110_TRAINING.report();



V110_UI.showReport(

r

);



}



};







document.addEventListener(

"DOMContentLoaded",

()=>{


V110_ENGINE.init();



}

);