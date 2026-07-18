// models/anti_human.js


export class AntiHumanModel {


    constructor(){


        this.name =
        "anti_human";


        this.frequency={};


        this.recent=[];


    }





    // =====================
    // 训练
    // =====================

    train(history){


        this.frequency={};



        history.forEach(item=>{


            item.front.forEach(n=>{


                if(
                    !this.frequency[n]
                ){

                    this.frequency[n]=0;

                }


                this.frequency[n]++;


            });


        });




        this.recent =
        history.slice(-20);



    }





    // =====================
    // 热号惩罚
    // =====================

    hotPenalty(
        number
    ){


        let count =
        this.frequency[number]
        ||
        0;



        return count * 0.05;


    }





    // =====================
    // 重复结构惩罚
    // =====================

    repeatPenalty(
        candidate
    ){


        let penalty=0;



        this.recent.forEach(item=>{


            let same =
            candidate.front.filter(
                n=>
                item.front.includes(n)
            )
            .length;



            if(
                same>=4
            ){

                penalty += 5;

            }
            else if(
                same>=3
            ){

                penalty += 2;

            }



        });



        return penalty;


    }





    // =====================
    // 人类常见模式惩罚
    // =====================

    patternPenalty(
        candidate
    ){


        let penalty=0;



        let front =
        candidate.front;



        // 连号过多

        let serial=0;



        for(
            let i=1;
            i<front.length;
            i++
        ){


            if(
                front[i]
                -
                front[i-1]
                ===1
            ){

                serial++;

            }


        }



        if(
            serial>=3
        ){

            penalty+=3;

        }





        // 五个号码过于平均

        let span =
        front[
            front.length-1
        ]
        -
        front[0];



        if(
            span<10
        ){

            penalty+=3;

        }





        return penalty;


    }





    // =====================
    // 候选评分
    // =====================

    predict(candidate){


        let score=0;



        candidate.front.forEach(n=>{


            score -=

            this.hotPenalty(
                n
            );


        });




        score -=

        this.repeatPenalty(
            candidate
        );



        score -=

        this.patternPenalty(
            candidate
        );





        return {


            model:
            this.name,


            score


        };



    }



}