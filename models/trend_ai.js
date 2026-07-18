// models/trend_ai.js


export class TrendAIModel {


    constructor(){


        this.name =
            "trend_ai";


        this.window =
            100;


        this.history=[];


    }



    // =========================
    // 训练
    // =========================

    train(history){


        this.history =
            history.slice(
                -this.window
            );



        return 1;


    }



    // =========================
    // 遗漏计算
    // =========================

    omission(
        number,
        type="front"
    ){


        let count=0;



        for(
            let i=this.history.length-1;
            i>=0;
            i--
        ){


            let list =
                type==="front"
                ?
                this.history[i].front
                :
                this.history[i].back;



            if(
                list.includes(number)
            ){

                break;

            }



            count++;


        }



        return count;


    }



    // =========================
    // 近期热度
    // =========================

    recentScore(
        number
    ){


        let count=0;



        this.history.forEach(
            item=>{


                if(
                    item.front
                    .includes(number)
                ){

                    count++;

                }


            }
        );



        return (
            count /
            this.history.length
        );


    }



    // =========================
    // 趋势评分
    // =========================

    numberScore(number){


        let recent =
            this.recentScore(
                number
            );



        let omit =
            this.omission(
                number
            );



        /*
          避免简单追热

          近期热度 +
          适度遗漏修正
        */



        let score =
            recent*0.7
            +
            Math.min(
                omit/30,
                1
            )
            *
            0.3;



        return score;


    }



    // =========================
    // 候选评分
    // =========================

    predict(candidate){


        let score=0;



        candidate.front
        .forEach(n=>{


            score +=
                this.numberScore(n);


        });



        candidate.back
        .forEach(n=>{


            score +=
                this.numberScore(n);


        });



        return {


            model:
                this.name,


            score:
                score/7


        };


    }



}