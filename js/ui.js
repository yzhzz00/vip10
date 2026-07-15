window.DLT_UI={



set(id,text){



let el=

document.getElementById(id);



if(el){



el.innerHTML=text;



}



},







showPrediction(data){



let html="";



data.forEach((x,i)=>{



html+=`

<div class="result-card">

<h3>

TOP ${i+1}

</h3>


<p>

${x.front.join(" ")}

</p>


<p>

评分:

${x.score.toFixed(2)}

</p>


</div>

`;



});



this.set(

"prediction",

html

);



},







progress(num){



this.set(

"trainStatus",

"进度："+num+"%"

);



}






};