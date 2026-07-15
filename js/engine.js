window.DLT_ENGINE={



history:[],





init(text){



this.history=

DLT_PARSER.parse(text);



return {


count:this.history.length


};



},







async analyze(callback){



if(this.history.length===0){



return [];



}



let result=

DLT_PREDICTOR.predict(

this.history

);



return await DLT_MONTECARLO.run(

result,

false,

callback

);



},







train(callback){



return DLT_TRAINING.start(

this.history,

callback

);



},







report(){



return DLT_REPORT.generate();



}





};