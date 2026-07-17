// DLT-AI-CORE VIP
// core/features.js
//
// 特征工程模块
//
// 作用:
// 将历史开奖转换为AI可分析特征
//
// 特征:
// 1.和值
// 2.奇偶结构
// 3.三区分布
// 4.连号
// 5.重复号码
// 6.跨度
// 7.大小结构


import CONFIG from "../config.js";



class FeatureEngine {



    constructor(){


        this.features=[];


    }








    // ======================
    // 生成全部特征
    // ======================

    build(history){



        this.features=history.map(

            (item,index)=>{



                return {


                    index:index+1,



                    front:item.front,



                    back:item.back,



                    sum:

                    this.sum(item.front),



                    oddEven:

                    this.oddEven(item.front),



                    zone:

                    this.zone(item.front),



                    consecutive:

                    this.consecutive(item.front),



                    repeat:

                    this.repeat(

                        history,

                        index

                    ),



                    span:

                    this.span(item.front),



                    bigSmall:

                    this.bigSmall(item.front)



                };



            }

        );






        return this.features;


    }









    // ======================
    // 和值
    // ======================

    sum(numbers){



        return numbers.reduce(

            (a,b)=>a+b,

            0

        );


    }









    // ======================
    // 奇偶
    // ======================

    oddEven(numbers){



        let odd=

        numbers.filter(

            n=>n%2!==0

        ).length;



        return {


            odd,


            even:

            numbers.length-odd



        };


    }









    // ======================
    // 三区结构
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





        return {


            first:z1,


            second:z2,


            third:z3



        };


    }









    // ======================
    // 连号数量
    // ======================

    consecutive(numbers){



        let count=0;



        for(

            let i=1;

            i<numbers.length;

            i++

        ){



            if(

                numbers[i]

                -

                numbers[i-1]

                ===1

            ){


                count++;


            }


        }





        return count;


    }









    // ======================
    // 与上一期重复
    // ======================

    repeat(

        history,

        index

    ){



        if(index===0)

            return 0;





        const last=

        history[index-1].front;



        const current=

        history[index].front;





        return current.filter(

            n=>

            last.includes(n)

        ).length;



    }









    // ======================
    // 跨度
    // ======================

    span(numbers){



        return Math.max(

            ...numbers

        )

        -

        Math.min(

            ...numbers

        );


    }









    // ======================
    // 大小结构
    // ======================

    bigSmall(numbers){



        let big=

        numbers.filter(

            n=>n>17

        ).length;



        return {


            big,


            small:

            numbers.length-big



        };


    }









    // ======================
    // 状态
    // ======================

    status(){



        return {


            count:

            this.features.length



        };


    }




}



export default new FeatureEngine();