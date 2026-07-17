// DLT-AI-CORE VIP
// core/backtest.js
// 历史滚动回测模块
//
// 目的：
// 验证模型是否比随机选号更有效
//
// 方法：
// 使用历史某一期之前的数据
// 模拟当时预测下一期
// 再与真实开奖比较


import DataManager from "./data.js";
import Features from "./features.js";
import Models from "./models.js";
import Matrix from "./matrix.js";
import Generator from "./generator.js";
import Filter from "./filter.js";
import Score from "./score.js";



class Backtest {



    constructor(){


        this.data =

        new DataManager();



        this.features =

        new Features();



        this.models =

        new Models();



        this.matrix =

        new Matrix();



        this.generator =

        new Generator();



        this.filter =

        new Filter();



        this.score =

        new Score();



    }









    run(period=100){



        const history =

        this.data.load();





        let result={



            total:0,


            front3:0,


            front4:0,


            front5:0,


            back1:0,


            back2:0



        };









        const start =

        history.length

        -

        period;









        for(

            let i=start;

            i<history.length;

            i++

        ){



            const trainData =

            history.slice(

                0,

                i

            );





            const real =

            history[i];








            const featureData =

            this.features.analyze(

                trainData

            );








            const modelData =

            this.models.run(

                trainData,

                featureData

            );








            const matrixData =

            this.matrix.build(

                modelData

            );








            const candidates =

            this.generator.generate(

                this.matrix,

                trainData

            );








            const filtered =

            this.filter.filter(

                candidates,

                trainData

            );








            const ranked =

            this.score.rank(

                filtered,

                matrixData,

                trainData

            );








            const prediction =

            ranked[0];







            if(!prediction)

                continue;








            const frontHit =

            this.hit(

                prediction.front,

                real.front

            );








            const backHit =

            this.hit(

                prediction.back,

                real.back

            );









            result.total++;





            if(frontHit>=3)

                result.front3++;



            if(frontHit>=4)

                result.front4++;



            if(frontHit===5)

                result.front5++;



            if(backHit>=1)

                result.back1++;



            if(backHit===2)

                result.back2++;





        }







        return {



            period,



            ...result,



            rate:{



                front3:

                this.rate(

                    result.front3,

                    result.total

                ),



                front4:

                this.rate(

                    result.front4,

                    result.total

                ),



                front5:

                this.rate(

                    result.front5,

                    result.total

                ),



                back2:

                this.rate(

                    result.back2,

                    result.total

                )



            }



        };



    }









    hit(a,b){



        return a.filter(

            n=>

            b.includes(n)

        )

        .length;



    }









    rate(a,b){



        if(b===0)

            return "0%";



        return (

            (

                a/b

            )

            *

            100

        )

        .toFixed(2)

        +"%";



    }





}



export default Backtest;