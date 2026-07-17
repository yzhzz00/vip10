// DLT-AI-CORE VIP
// core/validator.js
// 数据与模型输入校验模块
// 防止 undefined / 格式错误导致系统崩溃


class Validator {


    constructor(){


        this.error=[];


    }





    // ======================
    // 检查单期开奖数据
    // ======================

    checkDraw(draw){



        this.error=[];



        if(!draw){


            this.error.push(
                "开奖数据为空"
            );


            return false;

        }



        if(!Array.isArray(draw.front)){


            this.error.push(
                "前区数据不存在"
            );


            return false;


        }




        if(!Array.isArray(draw.back)){


            this.error.push(
                "后区数据不存在"
            );


            return false;


        }





        if(draw.front.length!==5){


            this.error.push(
                "前区数量错误"
            );


            return false;


        }





        if(draw.back.length!==2){


            this.error.push(
                "后区数量错误"
            );


            return false;


        }





        return true;



    }









    // ======================
    // 检查历史数据
    // ======================

    checkHistory(history){



        this.error=[];



        if(!Array.isArray(history)){


            this.error.push(
                "历史数据不是数组"
            );


            return false;


        }





        if(history.length===0){


            this.error.push(
                "历史数据为空"
            );


            return false;


        }







        for(let i=0;i<history.length;i++){



            if(
                !this.checkDraw(history[i])
            ){



                this.error.push(

                    "第"+i+"期数据错误"

                );


                return false;


            }


        }






        return true;



    }









    // ======================
    // 检查预测结果
    // ======================

    checkPrediction(result){



        this.error=[];




        if(!result){


            this.error.push(
                "预测为空"
            );


            return false;


        }







        if(
            !Array.isArray(result.front)
        ){


            this.error.push(
                "预测前区错误"
            );


            return false;


        }






        if(
            !Array.isArray(result.back)
        ){


            this.error.push(
                "预测后区错误"
            );


            return false;


        }





        return true;



    }









    getErrors(){



        return this.error;



    }



}



export default Validator;