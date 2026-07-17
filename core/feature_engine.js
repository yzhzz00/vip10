// DLT-AI-CORE VIP
// core/feature_engine.js
//
// 特征工程引擎
//
// 生成:
// 三区
// 奇偶
// 大小
// 和值
// 连号
// 重号
// 遗漏
// 周期
// 后区结构


class FeatureEngine {


    constructor(){


        this.features = [];


    }







    // ======================
    // 构建全部特征
    // ======================

    build(history){


        this.features =


        history.map(

            (item,index)=>{


                return {


                    index,


                    front:item.front,


                    back:item.back,



                    front_zone:

                    this.zone(

                        item.front

                    ),



                    odd_even:

                    this.oddEven(

                        item.front

                    ),



                    front_sum:

                    this.sum(

                        item.front

                    ),



                    front_big_small:

                    this.bigSmall(

                        item.front

                    ),



                    consecutive:

                    this.consecutive(

                        item.front

                    ),



                    repeat:

                    this.repeat(

                        history,

                        index

                    ),



                    back_structure:

                    this.backStructure(

                        item.back

                    )


                };


            }

        );


        return this.features;


    }









    // ======================
    // 前区三区
    // ======================

    zone(numbers){


        let result = {


            zone1:0,

            zone2:0,

            zone3:0


        };



        numbers.forEach(num=>{


            if(num<=12)

                result.zone1++;



            else if(num<=24)

                result.zone2++;



            else

                result.zone3++;



        });



        return result;


    }









    // ======================
    // 奇偶
    // ======================

    oddEven(numbers){



        let odd=0;



        numbers.forEach(n=>{


            if(n%2!==0)

                odd++;


        });




        return {


            odd,


            even:

            numbers.length-odd


        };


    }









    // ======================
    // 和值
    // ======================

    sum(numbers){



        return numbers.reduce(

            (a,b)=>

            a+b,

            0

        );


    }









    // ======================
    // 大小结构
    // ======================

    bigSmall(numbers){


        let big=0;



        numbers.forEach(n=>{


            if(n>=18)

                big++;


        });






        return {


            big,


            small:

            numbers.length-big


        };


    }









    // ======================
    // 连号数量
    // ======================

    consecutive(numbers){



        let count=0;



        let arr=[...numbers]

        .sort(

            (a,b)=>a-b

        );







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

    repeat(history,index){



        if(index===0)

            return 0;






        let current=

        history[index].front;



        let last=

        history[index-1].front;






        return current.filter(

            n=>

            last.includes(n)

        ).length;



    }









    // ======================
    // 后区结构
    // ======================

    backStructure(numbers){



        let odd=0;



        numbers.forEach(n=>{


            if(n%2!==0)

                odd++;


        });






        return {


            odd,


            even:

            numbers.length-odd,



            sum:

            numbers.reduce(

                (a,b)=>a+b,

                0

            )

        };


    }









    // ======================
    // 获取特征
    // ======================

    get(){


        return this.features;


    }



}





export default new FeatureEngine();