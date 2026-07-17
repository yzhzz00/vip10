// DLT-AI-CORE VIP
// ai/committee.js
//
// AI委员会 V2
//
// 功能:
// 1.模型权重融合
// 2.模型状态过滤
// 3.评分归一化
// 4.输出统一评分


class Committee {


    constructor(){


        this.result={};


    }








    decide(

        modelResult,

        weights={},

        status={}

    ){



        let front={};


        let back={};





        Object.keys(modelResult)

        .forEach(name=>{



            // 淘汰模型跳过

            if(

                status[name]

                &&

                status[name].state

                ===

                "retired"

            ){

                return;

            }







            let model=

            modelResult[name];







            let weight=

            weights[name]

            ||

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







        this.result={



            front:

            this.normalize(

                front

            ),



            back:

            this.normalize(

                back

            )



        };







        return this.result;



    }









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

                !target[item.number]

            ){



                target[item.number]=0;



            }







            target[item.number]

            +=

            (

                item.score || 0

            )

            *

            weight;



        });



    }









    normalize(data){



        let values=

        Object.values(data);







        if(

            values.length===0

        )

        return [];







        let max=

        Math.max(

            ...values

        );







        return Object.keys(data)

        .map(num=>{



            return {



                number:

                Number(num),



                score:

                Number(

                    (

                    data[num]

                    /

                    max

                    *

                    100

                    )

                    .toFixed(2)

                )



            };



        })

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