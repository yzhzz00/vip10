window.V1000_WEIGHT={



adjust(){



let report=

V1000_TRAINING.report();



let w=

V1000_CONFIG.weights;




if(
Number(report.last100.front)>1.5
){



w.trend+=0.01;



}



else{


w.trend-=0.01;


}






V1000_STORAGE.weights(w);



return w;



}




};