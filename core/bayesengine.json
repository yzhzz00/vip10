// 大乐透AI_V90
// Bayes Engine
// 贝叶斯概率修正引擎


window.BayesEngine = {


    history: [],


    prior:{},


    posterior:{},



    initialized:false,






    // 初始化


    init(history=[]){


        this.history =
        history;



        this.calculatePrior();



        this.initialized=true;



        console.log(
            "BayesEngine初始化完成"
        );



    },









    // 计算先验概率


    calculatePrior(){



        let count={};



        this.history.forEach(
            item=>{


                item.front.forEach(
                    n=>{


                        count[n] =
                        (count[n]||0)+1;


                    }
                );


            }
        );



        let total =
        this.history.length * 5;



        for(
            let n=1;
            n<=35;
            n++
        ){



            this.prior[n] =

            (count[n]||0)
            /
            total;



        }




    },









    // 贝叶斯更新


    update(
        evidence={}
    ){



        let result={};




        for(
            let n in this.prior
        ){



            let prior =
            this.prior[n];



            let likelihood =

            evidence[n]
            ||
            1;



            result[n] =

            prior *
            likelihood;



        }



        this.posterior =

        this.normalize(
            result
        );



        return this.posterior;



    },









    // 条件概率修正


    conditionalUpdate(
        recent=[]
    ){



        let factor={};



        recent.forEach(
            item=>{


                item.front.forEach(
                    n=>{


                        factor[n] =

                        (
                            factor[n]||0
                        )
                        +
                        1;


                    }
                );


            }
        );



        return this.update(
            factor
        );



    },









    // 获取预测概率


    predict(){


        return this.posterior;


    },









    // 归一化


    normalize(data){



        let sum=0;



        for(
            let k in data
        ){


            sum += data[k];


        }




        let result={};



        if(sum===0){

            return data;

        }




        for(
            let k in data
        ){



            result[k] =

            data[k]/sum;



        }




        return result;



    }






};