window.V110_PARSER={


parse(text){


let list=[];


text.split(/\r?\n/)

.forEach(line=>{


line=line.trim();


if(!line)return;



let a=line.split(/\s+/);



if(a.length<9)return;



list.push({


period:a[0],


date:a[1],



front:[

Number(a[2]),
Number(a[3]),
Number(a[4]),
Number(a[5]),
Number(a[6])

],



back:[

Number(a[7]),
Number(a[8])

]



});



});



return list;


}



};