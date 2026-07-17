// DLT-AI-CORE VIP
// models/cycle_model.js
//
// 周期模型
//
// 分析号码历史出现周期


class CycleModel {



    constructor(){


        this.front=[];


        this.back=[];


    }









    train(history){



        this.front=

        this.calculate(

            history,

            35,

            "front"

        );







        this.back=

        this.calculate(

            history,

            12,

            "back"

        );







        return true;


    }









    calculate(

        history,

        maxNum,

        type

    ){



        let result=[];







        for(

            let num=1;

            num<=maxNum;

            num++

        ){



            let positions=[];







            history.forEach(

                (item,index)=>{



                    if(

                        item[type]

                        .includes(num)

                    ){



                        positions.push(

                            index

                        );



                    }



                }

            );







            if(

                positions.length<2

            ){



                result.push({



                    number:num,



                    cycle:0,



                    position:0,



                    score:10



                });



                continue;



            }







            let gaps=[];







            for(

                let i=1;

                i<positions.length;

                i++

            ){



                gaps.push(

                    positions[i]

                    -

                    positions[i-1]

                );



            }







            let avgCycle=

            gaps.reduce(

                (a,b)=>

                a+b,

                0

            )

            /

            gaps.length;







            let last=

            history.length-1

            -

            positions[

                positions.length-1

            ];







            let distance=

            Math.abs(

                avgCycle-last

            );







            let score=

            100

            /

            (

                1+

                distance

            );







            result.push({



                number:num,



                cycle:

                Number(

                    avgCycle.toFixed(2)

                ),



                position:

                last,



                score:

                Number(

                    score.toFixed(2)

                )



            });



        }







        return result.sort(

            (a,b)=>

            b.score-a.score

        );


    }









    analyze(){



        return {



            front:this.front,



            back:this.back



        };


    }



}





export default new CycleModel();