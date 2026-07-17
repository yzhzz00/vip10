const api="";





async function load(){



let s=

await fetch(

api+"/api/status"

);



let status=

await s.json();





document.getElementById(

"status"

).innerHTML=

`

状态:

${status.status.status}

<br>

历史:

${status.status.history}期

<br>

进度:

${status.status.progress}%

`;







let m=

await fetch(

api+"/api/models"

);



let models=

await m.json();





let html="";



Object.keys(

models.weights

)

.forEach(k=>{


html+=`

<p>

${k}

:

${models.weights[k]}

</p>

`;


});





document.getElementById(

"models"

).innerHTML=

html;



}









async function predict(){



let r=

await fetch(

api+"/api/predict"

);



let data=

await r.json();




showResult(

data.result

);



}







function showResult(list){



let html="";



list.forEach((x,i)=>{



html+=`

<div class="result">

第${i+1}组

<br>

前区:

${x.front.join(" ")}

<br>

后区:

${x.back.join(" ")}

<br>

评分:

${x.score}

</div>

`;



});




document.getElementById(

"result"

).innerHTML=

html;



}









async function montecarlo(){



let timer=

setInterval(

async()=>{



let r=

await fetch(

api+"/api/montecarlo/status"

);



let s=

await r.json();




document.getElementById(

"bar"

).style.width=

s.progress+"%";




document.getElementById(

"mcstatus"

).innerHTML=

s.message+

"<br>"+

s.current+

"/"+

s.total;



if(

s.progress>=100

)

clearInterval(timer);



},

500

);





await fetch(

api+"/api/montecarlo"

);



}









async function feedback(){



let data={


issue:

issue.value,



front:[

Number(f1.value),

Number(f2.value),

Number(f3.value),

Number(f4.value),

Number(f5.value)

],



back:[

Number(b1.value),

Number(b2.value)

]



};





let r=

await fetch(

api+"/api/feedback",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:

JSON.stringify(data)


}

);



let result=

await r.json();




document.getElementById(

"feedback"

).innerHTML=

"反馈完成";



}







load();