// DLT-AI-CORE V11 FINAL
// core/validator.js
// 数据验证引擎


class Validator {


    constructor(){


        this.errors = [];


    }









    check(history){


        this.errors = [];



        if(
            !Array.isArray(history)
        ){


            throw new Error(
                "History data format error"
            );


        }



        history.forEach(
            (item,index)=>{


                this.checkDraw(
                    item,
                    index
                );


            }
        );



        return {


            valid:
            this.errors.length===0,


            errors:
            this.errors



        };


    }









    checkDraw(
        item,
        index
    ){


        if(
            !item.front ||
            !item.back
        ){


            this.errors.push({

                index,

                error:
                "Missing number data"

            });


            return;


        }



        if(
            item.front.length!==5
        ){


            this.errors.push({

                index,

                error:
                "Front number count error"

            });


        }



        if(
            item.back.length!==2
        ){


            this.errors.push({

                index,

                error:
                "Back number count error"

            });


        }



        this.checkRange(
            item.front,
            1,
            35,
            "front",
            index
        );



        this.checkRange(
            item.back,
            1,
            12,
            "back",
            index
        );



        this.checkRepeat(
            item.front,
            "front",
            index
        );



        this.checkRepeat(
            item.back,
            "back",
            index
        );


    }









    checkRange(
        numbers,
        min,
        max,
        type,
        index
    ){


        numbers.forEach(
            n=>{


                if(
                    n<min ||
                    n>max
                ){


                    this.errors.push({

                        index,

                        type,

                        number:n,

                        error:
                        "Number out of range"

                    });


                }


            }
        );


    }









    checkRepeat(
        numbers,
        type,
        index
    ){


        const set =
        new Set(numbers);



        if(
            set.size
            !==
            numbers.length
        ){


            this.errors.push({

                index,

                type,

                error:
                "Duplicate numbers"

            });


        }


    }









    getErrors(){


        return this.errors;


    }



}



export default Validator;