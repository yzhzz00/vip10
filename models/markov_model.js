// DLT-AI-CORE VIP
// models/markov_model.js
//
// 马尔可夫转移模型
//
// 分析:
// 当前状态
// ↓
// 下一状态概率


class MarkovModel {


    constructor(){


        this.name = "markov";


        this.frontTransition = {};

        this.backTransition = {};


        this.zoneTransition = {};



    }







    // ======================
    // 训练
    // ======================

    train(history){



        for(

            let i=1;

            i<history.length;

            i++

        ){



            let previous =

            history[i-1];



            let current =

            history[i];








            // 前区号码转移

            previous.front.forEach(oldNum=>{


                if(

                    !this.frontTransition[oldNum]

                ){



                    this.frontTransition[oldNum]={};



                }







                current.front.forEach(newNum=>{


                    this.frontTransition[oldNum][newNum]=

                    (

                        this.frontTransition[oldNum][newNum]

                        ||

                        0

                    )

                    +1;



                });



            });









            // 后区号码转移

            previous.back.forEach(oldNum=>{


                if(

                    !this.backTransition[oldNum]

                ){



                    this.backTransition[oldNum]={};



                }







                current.back.forEach(newNum=>{


                    this.backTransition[oldNum][newNum]=

                    (

                        this.backTransition[oldNum][newNum]

                        ||

                        0

                    )

                    +1;



                });



            });









            // 区域状态转移

            let oldZone =

            this.getZone(

                previous.front

            );





            let newZone =

            this.getZone(

                current.front

            );







            if(

                !this.zoneTransition[oldZone]

            ){


                this.zoneTransition[oldZone]={};


            }






            this.zoneTransition[oldZone][newZone]=

            (

                this.zoneTransition[oldZone][newZone]

                ||

                0

            )

            +1;





        }








        return this;


    }









    // ======================
    // 区三区间
    // ======================

    getZone(numbers){



        let zone1=0;


        let zone2=0;


        let zone3=0;







        numbers.forEach(num=>{



            if(num<=12)

                zone1++;


            else if(num<=24)

                zone2++;


            else

                zone3++;



        });







        return `${zone1}-${zone2}-${zone3}`;


    }









    // ======================
    // 获取转移概率
    // ======================

    probability(

        table,

        from

    ){



        let data =

        table[from];





        if(!data)

            return {};







        let total =

        Object.values(data)

        .reduce(

            (a,b)=>a+b,

            0

        );







        let result={};







        Object.keys(data)

        .forEach(key=>{


            result[key]=

            Number(

                (

                data[key]

                /

                total

                )

                .toFixed(6)

            );



        });






        return result;


    }









    // ======================
    // 分析
    // ======================

    analyze(last){



        return {



            model:

            this.name,



            front:

            this.probability(

                this.frontTransition,

                last.front[0]

            ),



            back:

            this.probability(

                this.backTransition,

                last.back[0]

            ),



            zone:

            this.probability(

                this.zoneTransition,

                this.getZone(last.front)

            )



        };



    }




}





export default new MarkovModel();