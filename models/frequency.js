// models/frequency.js


export class FrequencyModel {


    constructor(){


        this.name =
            "frequency";


        this.frontFreq={};


        this.backFreq={};


    }



    // =========================
    // 初始化
    // =========================

    init(){


        for(
            let i=1;
            i<=35;
            i++
        ){

            this.frontFreq[i]=0;

        }



        for(
            let i=1;
            i<=12;
            i++
        ){

            this.backFreq[i]=0;

        }


    }



    // =========================
    // 训练历史数据
    // =========================

    train(history){


        this.init();



        history.forEach(item=>{


            item.front
            .forEach(n=>{


                this.frontFreq[n]++;


            });



            item.back
            .forEach(n=>{


                this.backFreq[n]++;


            });



        });



        return this.score();


    }



    // =========================
    // 频率标准化
    // =========================

    normalize(value,max){


        if(max===0){

            return 0;

        }


        return value/max;


    }



    // =========================
    // 获取号码评分
    // =========================

    frontScore(number){


        let max =
            Math.max(
                ...Object.values(
                    this.frontFreq
                )
            );



        return this.normalize(
            this.frontFreq[number] || 0,
            max
        );


    }



    backScore(number){


        let max =
            Math.max(
                ...Object.values(
                    this.backFreq
                )
            );



        return this.normalize(
            this.backFreq[number] || 0,
            max
        );


    }



    // =========================
    // 候选组合评分
    // =========================

    predict(candidate){


        let frontScore=0;

        let backScore=0;



        candidate.front
        .forEach(n=>{


            frontScore +=
                this.frontScore(n);


        });



        candidate.back
        .forEach(n=>{


            backScore +=
                this.backScore(n);


        });



        return {


            model:
                this.name,


            score:
                (
                    frontScore/5
                    +
                    backScore/2
                )
                /2


        };


    }



    // =========================
    // 模型状态
    // =========================

    getHot(){


        return Object.entries(
            this.frontFreq
        )
        .sort(
            (a,b)=>b[1]-a[1]
        )
        .slice(0,10);


    }



    getCold(){


        return Object.entries(
            this.frontFreq
        )
        .sort(
            (a,b)=>a[1]-b[1]
        )
        .slice(0,10);


    }



    score(){


        return {


            hot:
                this.getHot(),


            cold:
                this.getCold()


        };


    }


}