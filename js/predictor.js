window.V110_PREDICTOR={



predict(history){



V110_SEED.set(123456);



let meeting=

V110_CONFERENCE.vote(history);



let pool=[];



for(let i=0;i<500;i++){


let front=[...meeting.final];



while(front.length<5){


let n=

Math.floor(

V110_SEED.random()*35

)+1;



if(!front.includes(n))

front.push(n);


}



front.sort(
(a,b)=>a-b
);




pool.push({

front,

back:this.back()

});



}




let result=

this.simulate(pool);



return {


best:result[0],


top10:result.slice(0,10),


conference:meeting,


confidence:this.confidence(
meeting
)


};



},







back(){


let b=[];


while(b.length<2){


let n=

Math.floor(

V110_SEED.random()*12

)+1;



if(!b.includes(n))

b.push(n);



}


return b.sort(
(a,b)=>a-b
);


},







simulate(pool){



let map={};



for(let i=0;i<100000;i++){



let x=

pool[

Math.floor(

V110_SEED.random()

*

pool.length

)

];



let key=

x.front.join("-")
+
"+"
+
x.back.join("-");




if(!map[key]){


map[key]={

front:x.front,

back:x.back,

count:0

};


}



map[key].count++;



}



return Object.values(map)

.sort(

(a,b)=>b.count-a.count

);



},








confidence(meeting){



let c=60;



if(meeting.final.length===5)

c+=20;



if(meeting.members.length>=4)

c+=10;



return c>95?95:c;



}



};