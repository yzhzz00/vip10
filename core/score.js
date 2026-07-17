// DLT-AI-CORE VIP
// core/score.js
// 最终候选组合评分模块
//
// 综合：
// 1. 模型评分
// 2. 结构评分
// 3. 历史匹配
// 4. 稳定性评分


import Theory from "./theory.js";



class Score {



    constructor(){


        this.theory =

        new Theory();


    }









    rank(candidates, matrix, history=[]){



        const result=[];






        for(

            const item of candidates

        ){



            const score =

            this.calculate(

                item,

                matrix,

                history

            );






            result.push({



                front:

                item.front,



                back:

                item.back,



                score



            });



        }







        return result.sort(

            (a,b)=>

            b.score

            -

            a.score

        );



    }









    calculate(candidate,matrix,history){



        let total=0;






        // ======================
        // 模型号码评分
        // ======================


        candidate.front.forEach(num=>{



            if(

                matrix[num]

            ){



                total +=

                matrix[num].total;



            }



        });








        // ======================
        // 理论结构评分
        // ======================


        total +=

        this.theory.score(

            candidate

        );









        // ======================
        // 历史稳定性
        // ======================


        total +=

        this.historyScore(

            candidate,

            history

        );







        return Number(

            total.toFixed(4)

        );



    }









    // ======================
    // 历史相似度评分
    // ======================

    historyScore(candidate,history){



        if(

            history.length===0

        ){



            return 0;



        }







        let score=0;







        for(

            const draw of history

        ){



            const same=

            candidate.front.filter(

                n=>

                draw.front.includes(n)

            )

            .length;






            // 历史出现3-4个相同

            // 增加参考分

            if(

                same===3

            ){



                score+=2;



            }



            if(

                same===4

            ){



                score+=5;



            }



        }







        return score;



    }









    top(result,count=5){



        return result.slice(

            0,

            count

        );



    }





}



export default Score;