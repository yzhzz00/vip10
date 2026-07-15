window.V1000_FEEDBACK={




save(data){



let old=

V1000_STORAGE.getFeedback();



old.push({


...data,


time:new Date().toLocaleString()


});



V1000_STORAGE.feedback(old);



return true;



}





};