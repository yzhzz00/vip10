// 大乐透AI_V90
// Matrix Engine
// 多模型矩阵融合引擎


window.MatrixEngine = {


    weights:{},


    initialized:false,






    // 初始化


    init(weights={}){


        this.weights = {


            feature:
            weights.feature || 0.20,


            theory:
            weights.theory || 0.20,


            markov:
            weights.markov || 0.20,


            bayes:
            weights.bayes || 0.15,


            montecarlo:
            weights.montecarlo || 0.25



        };



        this.initialized=true;



        console.log(
            "MatrixEngine初始化完成"
        );



    },









    // 综合矩阵计算


    combine(data){



        let result={


            front:{},


            back:{}


        };





        if(data.feature){


            this.merge(

                result.front,

                data.feature,

                this.weights.feature

            );


        }





        if(data.theory){


            this.merge(

                result.front,

                data.theory,

                this.weights.theory

            );


        }







        if(data.markov){


            this.merge(

                result.front,

                data.markov.front,

                this.weights.markov

            );



            this.merge(

                result.back,

                data.markov.back,

                this.weights.markov

            );



        }






        if(data.bayes){


            this.merge(

                result.front,

                data.bayes.front,

                this.weights.bayes

            );


        }






        if(data.montecarlo){


            this.merge(

                result.front,

                data.montecarlo.front,

                this.weights.montecarlo

            );


        }






        return result;



    },









    // 权重合并


    merge(
        target,
        source,
        weight
    ){



        if(!source){

            return;

        }



        for(
            let key in source
        ){



            let value =
            source[key];



            if(
                typeof value !==
                "number"
            ){

                continue;

            }



            target[key] =

            (
                target[key]||0
            )

            +

            value *

            weight;



        }



    },









    // 归一化


    normalize(data){



        let max=0;



        for(
            let key in data
        ){


            if(
                data[key]>max
            ){

                max=data[key];

            }


        }



        if(max===0){

            return data;

        }



        let result={};



        for(
            let key in data
        ){


            result[key] =

            data[key]/max;



        }



        return result;



    }





};