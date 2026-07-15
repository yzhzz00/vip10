window.DLT_FEEDBACK={



save(data){



DLT_DATABASE.addFeedback(data);



return true;



},







compare(prediction,real){



let front=0;

let back=0;



prediction.front.forEach(n=>{


if(real.front.includes(n)){


front++;


}


});



prediction.back?.forEach(n=>{


if(real.back.includes(n)){


back++;


}


});



return {



frontHit:front,


backHit:back,


total:front+back



};



}





};