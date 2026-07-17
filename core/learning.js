// DLT-AI-CORE VIP
// core/learning.js
// 自动学习模块
//
// 功能：
// 1. 保存预测反馈
// 2. 更新模型权重
// 3. 防止单期结果影响过大
// 4. 为下一次预测提供优化参数


import fs from "fs";
import config from "../config.js";


class Learning {



    constructor(){


        this.file =

        config.storage.learningFile;



        this.weightFile =

        config.storage.weightFile;



        this.data=[];



        this.weights={

            ...config.model

        };



        this.load();



    }









    // ======================
    // 加载历史学习
    // ======================

    load(){



        if(

            fs.existsSync(

                this.file

            )

        ){



            try{



                this.data =

                JSON.parse(

                    fs.readFileSync(

                        this.file,

                        "utf8"

                    )

                );



            }

            catch(e){



                this.data=[];



            }



        }






        if(

            fs.existsSync(

                this.weightFile

            )

        ){



            try{



                this.weights =

                JSON.parse(

                    fs.readFileSync(

                        this.weightFile,

                        "utf8"

                    )

                );



            }

            catch(e){



                this.weights={

                    ...config.model

                };



            }



        }



    }









    // ======================
    // 输入反馈学习
    // ======================

    train(feedback){



        this.data.push(

            feedback

        );





        const result =

        feedback.score;







        const factor =



        result>=50

        ?

        1.02

        :

        0.99;








        Object.keys(

            this.weights

        )

        .forEach(model=>{



            this.weights[model]

            *=

            factor;





            // 权重限制

            if(

                this.weights[model]

                >

                config.learning.maxWeight

            ){



                this.weights[model]

                =

                config.learning.maxWeight;



            }







            if(

                this.weights[model]

                <

                config.learning.minWeight

            ){



                this.weights[model]

                =

                config.learning.minWeight;



            }



        });







        this.save();






        return {



            weights:

            this.weights,



            count:

            this.data.length



        };



    }









    // ======================
    // 保存学习状态
    // ======================

    save(){



        fs.writeFileSync(

            this.file,

            JSON.stringify(

                this.data,

                null,

                2

            )

        );






        fs.writeFileSync(

            this.weightFile,

            JSON.stringify(

                this.weights,

                null,

                2

            )

        );



    }









    // ======================
    // 获取状态
    // ======================

    status(){



        return {



            learningTimes:

            this.data.length,



            weights:

            this.weights



        };



    }





}



export default Learning;