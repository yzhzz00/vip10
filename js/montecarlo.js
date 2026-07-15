window.DLT_MONTECARLO={



async run(results,deep=false,callback){



let times=

deep

?

DLT_CONFIG.monteCarlo.deep

:

DLT_CONFIG.monteCarlo.normal;



let output=[];



let index=0;



for(let item of results){



let total=0;



let batch=0;



while(batch<times){



let size=Math.min(

DLT_CONFIG.mobile.batchSize,

times-batch

);



for(let i=0;i<size;i++){



total+=item.score;



}



batch+=size;



await this.sleep(

DLT_CONFIG.mobile.delay

);



}



output.push({



front:item.front,



score:total/times



});



index++;



if(callback){



callback(

Math.floor(

index/results.length*100

)

);



}



}



output.sort(

(a,b)=>b.score-a.score

);



return output;



},







sleep(ms){



return new Promise(

r=>setTimeout(r,ms)

);



}





};