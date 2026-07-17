// DLT-AI-CORE VIP
// core/committee.js
// 模型委员会
//
// 负责：
// 1. 管理多个模型表现
// 2. 根据历史表现调整模型贡献
// 3. 为学习模块提供依据
//
// 核心模型：
// frequency
// trend
// bayes
// markov
// omission
// cycle


import config from "../config.js";


class Committee {



    constructor(){


        this.weights = {

            frequency:
            config.model.frequency,


            trend:
            config.model.trend,


            bayes:
            config.model.bayes,


            markov:
            config.model.markov,


            omission:
            config.model.omission,


            cycle:
            config.model.cycle


        };


    }









    // ======================
    // 获取当前模型权重
    // ======================

    getWeights(){


        return {

            ...this.weights

        };


    }









    // ======================
    // 模型评分
    // ======================

    evaluate(results){



        const score={};





        Object.keys(

            this.weights

        )

        .forEach(model=>{


            score[model]=

            0;


        });






        if(!results)

            return score;







        Object.keys(results)

        .forEach(model=>{



            if(

                results[model]

            ){



                const values =

                Object.values(

                    results[model]

                );




                if(values.length>0){



                    const avg =

                    values.reduce(

                        (a,b)=>

                        a+b,

                        0

                    )

                    /

                    values.length;





                    score[model]=avg;



                }



            }



        });







        return score;



    }









    // ======================
    // 更新模型权重
    // ======================

    update(performance){



        Object.keys(

            this.weights

        )

        .forEach(model=>{





            if(

                performance[model]

                >

                0

            ){



                this.weights[model]

                *=

                1.02;



            }

            else{



                this.weights[model]

                *=

                0.98;



            }







            // 权重限制

            if(

                this.weights[model]

                >

                2

            ){



                this.weights[model]

                =

                2;



            }







            if(

                this.weights[model]

                <

                0.5

            ){



                this.weights[model]

                =

                0.5;



            }





        });






        return this.weights;



    }









    // ======================
    // 排名
    // ======================

    ranking(){



        return Object.entries(

            this.weights

        )

        .sort(

            (a,b)=>

            b[1]-a[1]

        );



    }





}



export default Committee;