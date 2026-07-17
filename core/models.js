// DLT-AI-CORE VIP
// core/models.js
// 多模型预测核心
//
// 保留模型核心：
// frequency 频率模型
// trend 趋势模型
// bayes 贝叶斯评分
// markov 马尔可夫转移
// omission 遗漏模型
// cycle 周期模型


import config from "../config.js";



class Models {



    constructor(){


        this.weights =

        config.model;



    }









    run(history,features){



        return {



            frequency:

            this.frequency(

                features.frequency

            ),



            trend:

            this.trend(

                features.trend

            ),



            bayes:

            this.bayes(

                features.frequency,

                history.length

            ),



            markov:

            this.markov(

                history

            ),



            omission:

            this.omission(

                features.omission

            ),



            cycle:

            this.cycle(

                features.cycle

            )



        };



    }









    // ======================
    // 频率模型
    // ======================

    frequency(data){



        const result={};



        data.forEach(item=>{



            result[item[0]]

            =

            Number(item[1])

            *

            this.weights.frequency;



        });






        return result;



    }









    // ======================
    // 趋势模型
    // ======================

    trend(data){



        const result={};



        data.forEach(item=>{



            result[item[0]]

            =

            Number(item[1])

            *

            this.weights.trend;



        });







        return result;



    }









    // ======================
    // 贝叶斯概率模型
    // ======================

    bayes(data,total){



        const result={};



        data.forEach(item=>{



            const n=

            Number(item[0]);



            const count=

            Number(item[1]);





            result[n]

            =

            (

                count+1

            )

            /

            (

                total+35

            )

            *

            this.weights.bayes;



        });







        return result;



    }









    // ======================
    // 马尔可夫转移模型
    // ======================

    markov(history){



        const matrix={};





        for(

            let i=1;

            i<history.length;

            i++

        ){



            const prev=

            history[i-1].front;



            const next=

            history[i].front;







            prev.forEach(a=>{



                if(!matrix[a])

                    matrix[a]={};





                next.forEach(b=>{



                    matrix[a][b]

                    =

                    (

                        matrix[a][b]

                        ||

                        0

                    )

                    +

                    1;



                });



            });



        }








        const result={};





        const last=

        history[history.length-1]

        .front;







        last.forEach(n=>{



            if(matrix[n]){



                Object.entries(

                    matrix[n]

                )

                .forEach(

                    ([k,v])=>{



                        result[k]

                        =

                        (

                            result[k]

                            ||

                            0

                        )

                        +

                        v;



                    }

                );



            }



        });







        return result;



    }









    // ======================
    // 遗漏模型
    // ======================

    omission(data){



        const result={};



        data.forEach(item=>{



            const n=

            item[0];



            const miss=

            Number(item[1]);






            result[n]

            =

            miss

            *

            this.weights.omission;



        });






        return result;



    }









    // ======================
    // 周期模型
    // ======================

    cycle(data){



        const result={};



        data.forEach(item=>{



            const n=

            item[0];



            const period=

            Number(item[1]);






            if(period>0){



                result[n]

                =

                (

                    1/period

                )

                *

                this.weights.cycle;



            }



        });






        return result;



    }






}



export default Models;