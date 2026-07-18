/**
 * DLT-AI-CORE VIP
 * Dashboard JS V7.0
 */


async function loadDashboard(){



const res=

await fetch(

"/api/dashboard"

);



const data=

await res.json();







document

.getElementById(

"system"

)

.innerHTML=`


状态:

${data.system.status}


<br>


版本:

${data.system.version}


`;









document

.getElementById(

"learning"

)

.innerHTML=


`

累计学习次数:

${data.learning.total}


<br><br>


最近学习:

${JSON.stringify(

data.learning.history.slice(-5)

)}


`;









let modelHtml="";





data.models.forEach(

m=>{


modelHtml+=`

<div class="card">


🤖 ${m.model}


<br>


权重:

${m.weight}


</div>


`;



});







document

.getElementById(

"models"

)

.innerHTML=

modelHtml;









let historyHtml="";





data.prediction.latest

.forEach(

p=>{


historyHtml+=`


<div class="card">


时间:

${p.time}


<br>


前区:

${p.front.join(" ")}


<br>


后区:

${p.back.join(" ")}


</div>


`;


});







document

.getElementById(

"history"

)

.innerHTML=

historyHtml;



}





loadDashboard();