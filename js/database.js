window.V110_DB={


save(key,data){

localStorage.setItem(

key,

JSON.stringify(data)

);

},



get(key){

let d=

localStorage.getItem(key);


return d?

JSON.parse(d):[];

},



saveTraining(data){

this.save(
"V110_TRAINING",
data
);

},



getTraining(){

return this.get(
"V110_TRAINING"
);

},



saveFeedback(data){

let old=this.get(
"V110_FEEDBACK"
);


old.push(data);


this.save(
"V110_FEEDBACK",
old
);

},



getFeedback(){

return this.get(
"V110_FEEDBACK"
);

},



saveConference(data){

this.save(
"V110_CONFERENCE",
data
);

},



getConference(){

return this.get(
"V110_CONFERENCE"
);

}



};