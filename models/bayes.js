// models/bayes.js


export class BayesModel {


    constructor(){


        this.name =
            "bayes";


        this.frontProbability={};


        this.backProbability={};


        this.alpha=1;


    }



    // =========================
    // 初始化先验
    // =========================

    init(){


        for(
            let i=1;
            i<=35;
            i++
        ){


            this.frontProbability[i]
                =
                this.alpha;


        }



        for(
            let i=1;
            i<=12;
            i++
        ){


            this.backProbability[i]
                =
                this.alpha;


        }


    }



    // =========================
    // 贝叶斯训练
    // =========================

    train(history){


        this.init();



        history.forEach(item=>{


            item.front
            .forEach(n=>{


                this.frontProbability[n]
                +=1;


            });



            item.back
            .forEach(n=>{


                this.backProbability[n]
                +=1;


            });



        });



        this.normalize();



        return 1;


    }



    // =========================
    // 概率归一化
    // =========================

    normalize(){



        let frontTotal =
            Object.values(
                this.frontProbability
            )
            .reduce(
                (a,b)=>a+b,
                0
            );



        for(
            let n in this.frontProbability
        ){


            this.frontProbability[n]
            /=
            frontTotal;


        }



        let backTotal =
            Object.values(
                this.backProbability
            )
            .reduce(
                (a,b)=>a+b,
                0
            );



        for(
            let n in this.backProbability
        ){


            this.backProbability[n]
            /=
            backTotal;


        }


    }



    // =========================
    // 单号码概率
    // =========================

    frontScore(number){


        return (
            this.frontProbability[number]
            ||
            0
        );


    }



    backScore(number){


        return (
            this.backProbability[number]
            ||
            0
        );


    }



    // =========================
    // 组合预测评分
    // =========================

    predict(candidate){


        let score=0;



        candidate.front
        .forEach(n=>{


            score +=
            this.frontScore(n);


        });



        candidate.back
        .forEach(n=>{


            score +=
            this.backScore(n);


        });



        return {


            model:
                this.name,


            score:
                score/7


        };


    }



    // =========================
    // 获取概率排序
    // =========================

    ranking(){


        return Object.entries(
            this.frontProbability
        )
        .sort(
            (a,b)=>
            b[1]-a[1]
        );


    }



}