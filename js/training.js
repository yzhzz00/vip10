window.DLT_TRAINING={



running:false,





async start(data,callback){



if(this.running){

return;

}



this.running=true;



let start=

DLT_DATABASE.getCheckpoint().index;



let total=

data.length-DLT_CONFIG.training.window;



for(

let i=start;

i<total;

i++

){



if(!this.running){

break;

}



let train=data.slice(

i,

i+DLT_CONFIG.training.window

);



let target=

data[i+DLT_CONFIG.training.window];



let prediction=

DLT_PREDICTOR.predict(train)[0];



let hit=0;



prediction.front.forEach(n=>{


if(target.front.includes(n)){


hit++;


}


});



DLT_DATABASE.addTrain({



index:i,


hit:hit,


predict:prediction.front,


real:target.front



});





DLT_DATABASE.saveCheckpoint({



index:i+1



});





if(callback){



callback(

Math.floor(

(i/total)*100

)

);



}



await this.sleep(50);



}



this.running=false;



},







stop(){



this.running=false;



},







sleep(ms){



return new Promise(

r=>setTimeout(r,ms)

);



}





};