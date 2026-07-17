// DLT-AI-CORE VIP
// ai/weight_manager.js
//
// 权重管理
//
// 功能:
// 1.模型权重初始化
// 2.权重调整
// 3.输出当前权重



class WeightManager {



    constructor(){


        this.weights={};



    }









    // ======================
    // 初始化权重
    // ======================

    init(models){



        models.forEach(name=>{



            this.weights[name]=1;



        });







        return this.weights;


    }









    // ======================
    // 获取权重
    // ======================

    get(){



        return this.weights;


    }









    // ======================
    // 更新权重
    // ======================

    update(

        model,

        score

    ){



        if(

            !this.weights[model]

        ){



            this.weights[model]=1;



        }







        let old=

        this.weights[model];







        // 表现好提高

        if(

            score>0.5

        ){



            old +=0.05;



        }

        else{


            old -=0.03;



        }







        // 限制范围

        if(

            old<0.1

        )

            old=0.1;





        if(

            old>3

        )

            old=3;







        this.weights[model]=

        Number(

            old.toFixed(4)

        );







        return this.weights[model];


    }









    // ======================
    // 批量更新
    // ======================

    batchUpdate(result){



        Object.keys(result)

        .forEach(model=>{



            this.update(

                model,

                result[model]

            );



        });



        return this.weights;


    }









    // ======================
    // 重置
    // ======================

    reset(){



        Object.keys(

            this.weights

        )

        .forEach(name=>{



            this.weights[name]=1;



        });



    }



}





export default new WeightManager();