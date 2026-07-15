window.V110_FEEDBACK={



save(){



let data={



period:
document.getElementById("period").value,



front:[

Number(front1.value),
Number(front2.value),
Number(front3.value),
Number(front4.value),
Number(front5.value)

],



back:[

Number(back1.value),
Number(back2.value)

],



time:new Date().toLocaleString()



};




V110_DB.saveFeedback(data);



alert(
"开奖已保存，等待AI学习"
);



return data;



}



};