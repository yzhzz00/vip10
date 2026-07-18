// ai/weights.js


export class WeightManager {


    constructor(){


        this.weights={};


        this.performance={};


        this.minWeight =
            0.05;


    }



    // =========================
    // 注册模型
    // =========================

    register(
        modelName
    ){


        if(
            !this.weights[modelName]
        ){


            this.weights[modelName]=1;


            this.performance[modelName]=[];


        }


    }



    // =========================
    // 记录模型表现
    // =========================

    record(
        modelName,
        score
    ){


        this.register(
            modelName
        );



        this.performance
        [modelName]
        .push(score);



    }



    // =========================
    // 计算平均表现
    // =========================

    average(
        modelName
    ){


        let list =
            this.performance
            [modelName]
            ||
            [];



        if(
            list.length===0
        ){

            return 0.5;

        }



        return (
            list.reduce(
                (a,b)=>a+b,
                0
            )
            /
            list.length
        );


    }



    // =========================
    // 自动调整权重
    // =========================

    update(){



        for(
            let model in this.weights
        ){


            let score =
                this.average(
                    model
                );



            if(
                score>0.6
            ){


                this.weights[model]
                *=
                1.1;


            }
            else if(
                score<0.4
            ){


                this.weights[model]
                *=
                0.9;


            }



            if(
                this.weights[model]
                <
                this.minWeight
            ){


                this.weights[model]
                =
                this.minWeight;


            }


        }



        return this.weights;


    }



    // =========================
    // 淘汰检测
    // =========================

    eliminate(){


        let removed=[];



        for(
            let model in this.weights
        ){


            if(
                this.average(model)
                <
                0.25
            ){


                removed.push(
                    model
                );


            }


        }



        return removed;


    }



    // =========================
    // 获取当前权重
    // =========================

    getWeights(){


        return this.weights;


    }



    // =========================
    // 权重排行榜
    // =========================

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