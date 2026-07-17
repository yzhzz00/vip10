// DLT-AI-CORE VIP
// models/dlt_theory_model.js
//
// 大乐透理论模型
//
// 包含:
// 三区理论
// 奇偶理论
// 和值理论
// 连号理论
// 重号理论
// 后区结构


class DltTheoryModel {


    constructor(){


        this.name = "dlt_theory";


        this.statistics = {

            zones:{},

            oddEven:{},

            sum:{},

            consecutive:{},

            repeat:{},

            back:{}

        };


    }







    // ======================
    // 训练
    // ======================

    train(history){



        history.forEach(

        (item,index)=>{



            let zone =

            this.zone(

                item.front

            );





            this.count(

                this.statistics.zones,

                zone

            );







            let odd =

            item.front.filter(

                n=>n%2!==0

            ).length;






            this.count(

                this.statistics.oddEven,

                odd

            );







            let sum =

            item.front.reduce(

                (a,b)=>a+b,

                0

            );






            let sumArea =

            this.sumArea(sum);






            this.count(

                this.statistics.sum,

                sumArea

            );








            let con =

            this.consecutive(

                item.front

            );







            this.count(

                this.statistics.consecutive,

                con

            );








            let repeat =

            index===0

            ?

            0

            :

            this.repeat(

                history[index-1].front,

                item.front

            );







            this.count(

                this.statistics.repeat,

                repeat

            );







            let back =

            this.backStructure(

                item.back

            );







            this.count(

                this.statistics.back,

                back

            );




        });



        return this;


    }









    // ======================
    // 三区
    // ======================

    zone(numbers){



        let z1=0;

        let z2=0;

        let z3=0;






        numbers.forEach(num=>{


            if(num<=12)

                z1++;

            else if(num<=24)

                z2++;

            else

                z3++;



        });






        return `${z1}-${z2}-${z3}`;


    }









    // ======================
    // 和值区间
    // ======================

    sumArea(sum){



        if(sum<80)

            return "low";



        if(sum<110)

            return "middle";



        return "high";


    }









    // ======================
    // 连号
    // ======================

    consecutive(numbers){



        let arr=

        [...numbers]

        .sort(

            (a,b)=>a-b

        );






        let count=0;






        for(

            let i=1;

            i<arr.length;

            i++

        ){



            if(

                arr[i]-arr[i-1]===1

            )

                count++;



        }






        return count;


    }









    // ======================
    // 重号
    // ======================

    repeat(

        last,

        current

    ){



        return current.filter(

            n=>

            last.includes(n)

        )

        .length;


    }









    // ======================
    // 后区结构
    // ======================

    backStructure(numbers){



        let odd=

        numbers.filter(

            n=>n%2!==0

        )

        .length;







        let big=

        numbers.filter(

            n=>n>6

        )

        .length;






        return `${odd}-${big}`;


    }









    // ======================
    // 统计
    // ======================

    count(

        obj,

        key

    ){



        obj[key]=

        (

            obj[key]

            ||

            0

        )

        +1;


    }









    // ======================
    // 结构评分
    // ======================

    scoreStructure(

        type,

        value

    ){



        let data=

        this.statistics[type];





        if(

            !data[value]

        )

            return 0;






        let total=

        Object.values(data)

        .reduce(

            (a,b)=>a+b,

            0

        );






        return Number(

            (

            data[value]

            /

            total

            )

            .toFixed(4)

        );


    }









    // ======================
    // 分析
    // ======================

    analyze(){



        return {



            model:

            this.name,



            statistics:

            this.statistics



        };


    }



}





export default new DltTheoryModel();