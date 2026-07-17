// DLT-AI-CORE VIP
// core/theory.js
// 大乐透结构理论约束模块
//
// 作用：
// 不负责选号
// 负责判断组合是否符合历史结构


import config from "../config.js";



class Theory {



    constructor(){


        this.rules = config.theory || {



            front:{

                minSum:60,

                maxSum:180,

                minOdd:1,

                maxOdd:4


            },


            back:{


                minSum:3,

                maxSum:35


            }



        };


    }









    // ======================
    // 总检测
    // ======================

    check(candidate){



        return {



            sum:

            this.checkSum(candidate),



            oddEven:

            this.checkOddEven(candidate),



            zone:

            this.checkZone(candidate),



            repeat:

            this.checkRepeat(candidate),



            consecutive:

            this.checkConsecutive(candidate)



        };



    }









    // ======================
    // 和值
    // ======================

    checkSum(candidate){



        const sum =

        candidate.front

        .reduce(

            (a,b)=>

            a+b,

            0

        );





        return (

            sum >=

            this.rules.front.minSum

        )

        &&

        (

            sum <=

            this.rules.front.maxSum

        );



    }









    // ======================
    // 奇偶
    // ======================

    checkOddEven(candidate){



        const odd =

        candidate.front.filter(

            n=>

            n%2!==0

        )

        .length;







        return (

            odd >=

            this.rules.front.minOdd

        )

        &&

        (

            odd <=

            this.rules.front.maxOdd

        );



    }









    // ======================
    // 三区
    // ======================

    checkZone(candidate){



        let low=0;

        let middle=0;

        let high=0;







        candidate.front.forEach(n=>{



            if(n<=12)

                low++;



            else if(n<=24)

                middle++;



            else

                high++;



        });







        // 大乐透常见结构

        if(

            low===0

            ||

            middle===0

            ||

            high===0

        ){



            return false;



        }






        return true;



    }









    // ======================
    // 连号控制
    // ======================

    checkConsecutive(candidate){



        const nums=

        [

            ...

            candidate.front

        ]

        .sort(

            (a,b)=>

            a-b

        );





        let count=0;







        for(

            let i=1;

            i<nums.length;

            i++

        ){



            if(

                nums[i]

                -

                nums[i-1]

                ===1

            ){



                count++;



            }



        }







        //允许0-2组连号

        return count<=2;



    }









    // ======================
    // 重复结构
    // 后续结合历史
    // ======================

    checkRepeat(candidate){



        return true;



    }









    // ======================
    // 评分
    // ======================

    score(candidate){



        let score=0;





        const result=

        this.check(candidate);







        if(result.sum)

            score+=20;



        if(result.oddEven)

            score+=20;



        if(result.zone)

            score+=20;



        if(result.consecutive)

            score+=20;



        if(result.repeat)

            score+=20;







        return score;



    }





}



export default Theory;