/*
================================

大乐透智能分析系统

V71.0

Frequency AI Engine

历史频率评分模块

================================
*/


class FrequencyEngine {


constructor(){


this.name="Frequency AI";


this.frontFrequency={};


this.backFrequency={};


}






analyze(history){



this.frontFrequency={};

this.backFrequency={};





// 初始化


for(let i=1;i<=35;i++){


this.frontFrequency[i]=0;


}



for(let i=1;i<=12;i++){


this.backFrequency[i]=0;


}






history.forEach(item=>{



item.front.forEach(n=>{


this.frontFrequency[n]++;


});




item.back.forEach(n=>{


this.backFrequency[n]++;


});



});






return {



front:this.frontFrequency,


back:this.backFrequency



};



}









frontScore(number){



let count=

this.frontFrequency[number] || 0;






// 频率标准化


let score=50;





if(count>350){



score+=15;


}

else if(count>300){



score+=10;


}

else if(count>250){



score+=5;


}

else if(count<200){



score-=5;


}






return score;



}









backScore(number){



let count=

this.backFrequency[number] || 0;



let score=50;





if(count>180){


score+=15;


}

else if(count>140){


score+=8;


}

else if(count<90){


score-=5;


}





return score;



}







ticketScore(ticket){



let score=0;



ticket.front.forEach(n=>{



score+=this.frontScore(n);



});






ticket.back.forEach(n=>{



score+=this.backScore(n);



});






return Number(

(score/7).toFixed(2)

);



}



}







window.FrequencyEngine=

new FrequencyEngine();