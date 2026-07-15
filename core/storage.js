window.V1000_STORAGE={



save(key,data){


localStorage.setItem(

key,

JSON.stringify(data)

);


},





load(key){



let d=

localStorage.getItem(key);



return d?

JSON.parse(d)

:

[];

},






history(data){


this.save(
"V1000_HISTORY",
data
);


},




getHistory(){


return this.load(
"V1000_HISTORY"
);


},





training(data){


this.save(
"V1000_TRAINING",
data
);


},




getTraining(){


return this.load(
"V1000_TRAINING"
);


},





feedback(data){


let old=

this.load(
"V1000_FEEDBACK"
);



old.push(data);



this.save(

"V1000_FEEDBACK",

old

);



},




getFeedback(){


return this.load(
"V1000_FEEDBACK"
);


},




weights(data){


this.save(

"V1000_WEIGHTS",

data

);


},




getWeights(){


return this.load(

"V1000_WEIGHTS"

);


}



};