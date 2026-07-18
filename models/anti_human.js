// models/anti_human.js


export class AntiHumanModel {


    constructor(){


        this.name =
            "anti_human";


    }



    // =========================
    // 热门规避
    // =========================

    hotNumberPenalty(
        numbers,
        frequency={}
    ){


        let penalty=0;



        numbers.forEach(n=>{


            let count =
                frequency[n] || 0;



            // 高频号码降低权重

            if(count>450){

                penalty += 0.15;

            }
            else if(count>400){

                penalty += 0.08;

            }


        });



        return penalty;


    }



    // =========================
    // 生日号规避
    // 01-31过度集中
    // =========================

    birthdayPenalty(numbers){


        let count =
            numbers.filter(
                n=>n<=31
            )
            .length;



        if(count===5){


            return 0.1;


        }


        return 0;



    }



    // =========================
    // 规则型选号惩罚
    // =========================

    patternPenalty(numbers){


        let penalty=0;



        let arr =
            [...numbers]
            .sort(
                (a,b)=>a-b
            );



        // 五连递增

        let consecutive=0;



        for(
            let i=1;
            i<arr.length;
            i++
        ){


            if(
                arr[i]-arr[i-1]===1
            ){

                consecutive++;

            }


        }



        if(consecutive>=3){

            penalty+=0.15;

        }



        // 尾号过于一致


        let tails =
            arr.map(
                n=>n%10
            );



        let same =
            tails.filter(
                n=>
                n===tails[0]
            )
            .length;



        if(same>=3){

            penalty+=0.1;

        }



        return penalty;


    }



    // =========================
    // 人类偏好检测
    // =========================

    humanBiasScore(numbers,frequency){


        let penalty=0;



        penalty +=
            this.hotNumberPenalty(
                numbers,
                frequency
            );



        penalty +=
            this.birthdayPenalty(
                numbers
            );



        penalty +=
            this.patternPenalty(
                numbers
            );



        let score =
            1-penalty;



        if(score<0){

            score=0;

        }



        return score;


    }



    // =========================
    // 模型接口
    // =========================

    predict(candidate,context={}){


        return {


            model:
                this.name,


            score:
                this.humanBiasScore(
                    candidate.front,
                    context.frequency || {}
                )

        };


    }



    train(history){


        /*
          后续由 learning.js
          输入历史反馈优化
        */


        return 0.5;


    }


}