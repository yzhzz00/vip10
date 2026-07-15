window.V1000_UI={



init(){


this.bind();


},




bind(){



let a=

document.getElementById(
"analyze"
);



if(a){



a.onclick=()=>{



let result=

V1000_ENGINE.analyze();



this.showPrediction(
result
);



};



}






let t=

document.getElementById(
"training"
);



if(t){



t.onclick=()=>{


let r=

V1000_TRAINING.run(

V1000_ENGINE.history

);



this.showTraining(r);



};



}





let b=

document.getElementById(
"backtest"
);



if(b){


b.onclick=()=>{


let r=

V1000_BACKTEST.run(

V1000_ENGINE.history,

[100,500,1000]

);



document.getElementById(

"backbox"

).innerHTML=

JSON.stringify(r);



};



}



},






showPrediction(data){



let html="";



data.forEach((x,i)=>{


html+=


"TOP"+(i+1)+": "

+

x.front.join(" ")

+

" + "

+

x.back.join(" ")

+

"<br>";



});



document.getElementById(

"result"

).innerHTML=html;



},






showTraining(data){



document.getElementById(

"trainbox"

).innerHTML=

"训练完成<br>"

+

"考试次数："

+

data.length;



}



};





window.addEventListener(

"load",

()=>{


V1000_UI.init();


});