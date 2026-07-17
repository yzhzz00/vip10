// DLT-AI-CORE VIP
// core/feature_engine.js
//
// 特征工程
//
// 功能:
// 生成大乐透核心统计特征


class FeatureEngine {


    constructor(){

        this.features={};

    }







    // ======================
    // 构建特征
    // ======================

    build(history){



        this.features={



            count:

            history.length,



            zone:

            this.zone(history),



            oddEven:

            this.oddEven(history),



            sum:

            this.sum(history),



            consecutive:

            this.consecutive(history),



            repeat:

            this.repeat(history),



            omission:

            this.omission(history),



            back:

            this.backStructure(history)



        };







        return this.features;


    }









    // ======================
    // 三区分析
    // ======================

    zone(history){



        let result={



            zone1:0,


            zone2:0,


            zone3:0



        };






        history.forEach(item=>{



            item.front.forEach(num=>{



                if(num<=12)

                    result.zone1++;



                else if(num<=24)

                    result.zone2++;



                else

                    result.zone3++;



            });



        });






        return result;


    }









    // ======================
    // 奇偶分析
    // ======================

    oddEven(history){



        let odd=0;


        let even=0;






        history.forEach(item=>{



            item.front.forEach(num=>{



                if(num%2)

                    odd++;


                else

                    even++;



            });



        });







        return {



            odd,


            even



        };


    }









    // ======================
    // 和值分析
    // ======================

    sum(history){



        let list=[];






        history.forEach(item=>{



            list.push(



                item.front.reduce(

                    (a,b)=>

                    a+b,

                    0

                )



            );



        });







        return {



            latest:

            list[0],



            average:

            Number(

                (

                list.reduce(

                    (a,b)=>

                    a+b,

                    0

                )

                /

                list.length

                )

                .toFixed(2)

            ),



            history:list



        };


    }









    // ======================
    // 连号分析
    // ======================

    consecutive(history){



        let count=0;






        history.forEach(item=>{



            let nums=

            item.front.sort(

                (a,b)=>a-b

            );






            for(

                let i=1;

                i<nums.length;

                i++

            ){



                if(

                    nums[i]-nums[i-1]===1

                )

                    count++;



            }



        });







        return {



            count



        };


    }









    // ======================
    // 重号分析
    // ======================

    repeat(history){



        let result=[];






        for(

            let i=1;

            i<history.length;

            i++

        ){



            let last=

            history[i-1].front;



            let now=

            history[i].front;







            let same=

            now.filter(

                n=>

                last.includes(n)

            );







            result.push(

                same

            );



        }







        return result;


    }









    // ======================
    // 遗漏分析
    // ======================

    omission(history){



        let result={};






        for(

            let num=1;

            num<=35;

            num++

        ){



            let gap=0;







            for(

                let i=0;

                i<history.length;

                i++

            ){



                if(

                    history[i].front.includes(num)

                ){



                    break;


                }



                gap++;



            }







            result[num]=gap;



        }







        return result;


    }









    // ======================
    // 后区结构
    // ======================

    backStructure(history){



        let result={



            small:0,


            big:0,


            odd:0,


            even:0



        };







        history.forEach(item=>{



            item.back.forEach(num=>{



                if(num<=6)

                    result.small++;


                else

                    result.big++;



                if(num%2)

                    result.odd++;


                else

                    result.even++;



            });



        });







        return result;


    }







    get(){



        return this.features;


    }



}





export default new FeatureEngine();