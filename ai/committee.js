// DLT-AI-CORE VIP
// ai/committee.js
//
// AI委员会
//
// 功能:
// 1.模型投票
// 2.权重融合
// 3.生成综合评分


class Committee {


    constructor(){

        this.result={};

    }







    // ======================
    // 模型决策
    // ======================

    decide(

        modelResult,

        weights={}

    ){



        let front={};


        let back={};







        Object.keys(modelResult)

        .forEach(name=>{



            let model=

            modelResult[name];







            let weight=

            weights[name]

            ??

            1;







            this.merge(

                front,

                model.front,

                weight

            );







            this.merge(

                back,

                model.back,

                weight

            );



        });







        let result={



            front:

            this.sort(

                front

            ),



            back:

            this.sort(

                back

            )



        };







        this.result=result;



        return result;


    }









    // ======================
    // 合并模型评分
    // ======================

    merge(

        target,

        list,

        weight

    ){



        if(

            !Array.isArray(list)

        )

            return;







        list.forEach(item=>{



            if(

                !item.number

            )

                return;







            if(

                !target[item.number]

            ){



                target[item.number]=0;



            }







            target[item.number]

            +=

            item.score

            *

            weight;



        });



    }









    // ======================
    // 排序
    // ======================

    sort(data){



        return Object.keys(data)

        .map(num=>({



            number:

            Number(num),



            score:

            Number(

                data[num]

                .toFixed(6)

            )



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );



    }









    get(){



        return this.result;


    }



}



export default new Committee();