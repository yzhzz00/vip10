window.V110_SEED={

value:123456,


set(seed){

this.value=seed;

},



random(){

this.value=(

this.value*9301+

49297

)%233280;


return this.value/233280;

}



};