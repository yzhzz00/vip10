window.V110_UI={





refreshData(){



let box=

document.getElementById(

"dataCount"

);



if(box){



box.innerHTML=

V110_ENGINE.history.length;



}



},







bind(){



let a=

document.getElementById(

"analyzeBtn"

);



if(a){



a.onclick=()=>{


V110_ENGINE.analyze();


};


}







let t=

document.getElementById(

"trainBtn"

);



if(t){



t.onclick=()=>{


V110_ENGINE.train();


};


}



},







showPrediction(r){



document.getElementById(

"confidence"

).innerHTML=

r.confidence+"%";





let meeting="";



r.conference.members.forEach(m=>{


meeting+=

m.name

+

": "

+

m.numbers.join(" ")

+

"<br>";



});




document.getElementById(

"conferenceBox"

).innerHTML=

meeting+

"<hr>最终融合："

+

r.conference.final.join(" ");









let html="";



r.top10.forEach((x,i)=>{


html+=


(i+1)

+

". "

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

"resultBox"

).innerHTML=

html;



},








showTraining(data){



let box=

document.getElementById(

"trainingBox"

);



box.innerHTML=


"训练完成<br>"+

"考试次数："+

data.length

+

"<br><br>"+

JSON.stringify(

V110_TRAINING.statistics(100)

);



},








showReport(r){



let box=

document.getElementById(

"reportBox"

);



box.innerHTML=

JSON.stringify(r);



}







};






document.addEventListener(

"DOMContentLoaded",

()=>{


V110_UI.bind();



});