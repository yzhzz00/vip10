window.MODEL_MATRIX={



score(num,history){



let total=0;


let value=0;



history.forEach(h=>{



if(h.front.includes(num)){



h.front.forEach(n=>{


if(n!==num){


value+=Math.abs(n-num);


total++;


}


});


}


});



return total?

value/(total*35)

:

0;



}



};