// ai/weights.js


export class WeightManager {


    constructor(){


        this.weights={};


        this.history={};


    }





    // =====================
    // 注册模型
    // =====================

    register(
        name
    ){


        if(
            !this.weights[name]
        ){


            this.weights[name]=1;


            this.history[name]=[];


        }



    }





    // =====================
    // 获取权重
    // =====================

    getWeight(
        name
    ){


        return (

            this.weights[name]
            ||
            0

        );


    }





    getWeights(){


        return this.weights;


    }





    // =====================
    // 记录反馈
    // =====================

    record(
        name,
        score
    ){


        if(
            !this.history[name]
        ){

            this.history[name]=[];

        }



        this.history[name]
        .push(
            score
        );


    }





    // =====================
    // 权重更新
    // =====================

    update(){



        Object.keys(
            this.history
        )
        .forEach(
        name=>{


            let list =
            this.history[name];



            if(
                list.length===0
            ){

                return;

            }



            let avg =

            list.reduce(
                (a,b)=>
                a+b,
                0
            )
            /
            list.length;



            /*
            
            表现越好
            权重越高

            表现差
            自动降低
            
            */



            this.weights[name]=

            Number(
                (
                    0.5
                    +
                    avg
                )
                .toFixed(4)
            );



        });



    }





    // =====================
    // 排名
    // =====================

    rank(){


        return Object.keys(
            this.weights
        )
        .sort(
        (a,b)=>

            this.weights[b]
            -
            this.weights[a]

        );


    }



}