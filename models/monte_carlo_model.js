// DLT-AI-CORE VIP
// models/monte_carlo_model.js
//
// 蒙特卡罗模拟模型
//
// 功能:
// 1.建立概率池
// 2.随机采样组合
// 3.统计组合频率
// 4.输出排序结果


class MonteCarloModel {


    constructor(){


        this.name = "monte_carlo";


        this.results = [];


    }







    // ======================
    // 构建概率池
    // ======================

    buildPool(scores){


        let pool=[];







        scores.forEach(item=>{


            let weight =

            Math.max(

                item.score,

                0.01

            );







            let times =

            Math.floor(

                weight*100

            );







            for(

                let i=0;

                i<times;

                i++

            ){


                pool.push(

                    item.number

                );


            }



        });







        return pool;


    }









    // ======================
    // 随机选择
    // ======================

    selectNumbers(

        pool,

        count

    ){



        let result=[];


        let temp=[...pool];







        while(

            result.length<count

        ){



            let index=

            Math.floor(

                Math.random()

                *

                temp.length

            );







            let num=

            temp[index];






            if(

                !result.includes(num)

            ){



                result.push(num);



            }





        }







        return result.sort(

            (a,b)=>a-b

        );


    }









    // ======================
    // 单次模拟
    // ======================

    simulate(

        frontPool,

        backPool

    ){



        return {



            front:

            this.selectNumbers(

                frontPool,

                5

            ),



            back:

            this.selectNumbers(

                backPool,

                2

            )



        };


    }









    // ======================
    // 大规模模拟
    // ======================

    run(

        frontScores,

        backScores,

        times=100000

    ){



        let frontPool=

        this.buildPool(

            frontScores

        );





        let backPool=

        this.buildPool(

            backScores

        );







        let map={};







        for(

            let i=0;

            i<times;

            i++

        ){



            let result=

            this.simulate(

                frontPool,

                backPool

            );







            let key=

            result.front.join("-")

            +

            "|"

            +

            result.back.join("-");







            map[key]=

            (

                map[key]

                ||

                0

            )

            +1;



        }







        this.results =

        Object.keys(map)

        .map(key=>{



            let arr=

            key.split("|");






            return {



                front:

                arr[0]

                .split("-")

                .map(Number),



                back:

                arr[1]

                .split("-")

                .map(Number),



                score:

                map[key]

                /

                times



            };



        })

        .sort(

            (a,b)=>

            b.score-a.score

        );








        return this.results;


    }









    // ======================
    // 输出
    // ======================

    analyze(){



        return {



            model:

            this.name,



            results:

            this.results.slice(

                0,

                100

            )



        };


    }



}





export default new MonteCarloModel();