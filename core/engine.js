window.V1000_ENGINE={


history:[],



async init(){



let res=

await fetch(

V1000_CONFIG.dataFile

);



let text=

await res.text();



this.history=

text.split(/\r?\n/)

.filter(x=>x.trim())

.map(line=>{


let a=line.split(/\s+/);



return {


period:a[0],


front:[

+a[2],
+a[3],
+a[4],
+a[5],
+a[6]

],


back:[

+a[7],
+a[8]

]


};



});





V1000_STORAGE.history(

this.history

);



},






analyze(){



V1000_SEED.set(20260715);



return V1000_PREDICTOR.predict(

this.history

);



}



};





window.addEventListener(
"load",
()=>{


V1000_ENGINE.init();


});