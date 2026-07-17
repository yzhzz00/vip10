// DLT-AI-CORE V11 FINAL
// core/theory.js
// 大乐透理论分析模块


import config from "../config.js";


class Theory {


    analyze(history){


        if(!history || history.length===0){

            return null;

        }


        return {


            zone:
            this.zoneAnalysis(history),


            oddEven:
            this.oddEvenAnalysis(history),


            bigSmall:
            this.bigSmallAnalysis(history),


            sum:
            this.sumAnalysis(history),


            span:
            this.spanAnalysis(history),


            repeat:
            this.repeatAnalysis(history),


            consecutive:
            this.consecutiveAnalysis(history),


            omission:
            this.omissionAnalysis(history),


            hotCold:
            this.hotColdAnalysis(history),


            back:
            this.backAnalysis(history)


        };


    }




    // 前区三区分析

    zoneAnalysis(history){


        let result = {


            low:0,

            middle:0,

            high:0


        };



        const latest =

        history[
            history.length-1
        ];



        for(const n of latest.front){


            if(n>=1 && n<=12)

                result.low++;


            else if(n>=13 && n<=24)

                result.middle++;


            else

                result.high++;


        }



        return result;


    }





    // 奇偶比例

    oddEvenAnalysis(history){


        const latest =

        history[
            history.length-1
        ];



        let odd=0;

        let even=0;



        for(const n of latest.front){


            if(n%2)

                odd++;

            else

                even++;


        }



        return {


            odd,

            even


        };


    }





    // 大小分析

    bigSmallAnalysis(history){


        const latest =

        history[
            history.length-1
        ];



        let small=0;

        let big=0;



        for(const n of latest.front){


            if(n<=17)

                small++;

            else

                big++;


        }



        return {


            small,

            big


        };


    }





    // 和值分析

    sumAnalysis(history){


        const latest =

        history[
            history.length-1
        ];



        const frontSum =

        latest.front
        .reduce(
            (a,b)=>a+b,
            0
        );



        const backSum =

        latest.back
        .reduce(
            (a,b)=>a+b,
            0
        );



        return {


            frontSum,

            backSum


        };


    }





    // 跨度

    spanAnalysis(history){


        const latest =

        history[
            history.length-1
        ];



        return {


            frontSpan:

            Math.max(
                ...latest.front
            )
            -
            Math.min(
                ...latest.front
            )


        };


    }





    // 重号分析

    repeatAnalysis(history){


        if(history.length<2)

            return 0;



        const current =

        history[
            history.length-1
        ]
        .front;



        const previous =

        history[
            history.length-2
        ]
        .front;



        return current.filter(

            n=>previous.includes(n)

        ).length;


    }





    // 连号分析

    consecutiveAnalysis(history){


        const nums =

        history[
            history.length-1
        ]
        .front
        .sort(
            (a,b)=>a-b
        );



        let count=0;



        for(
            let i=1;
            i<nums.length;
            i++
        ){


            if(
                nums[i]-nums[i-1]===1
            ){

                count++;

            }


        }



        return count;


    }





    // 遗漏分析

    omissionAnalysis(history){


        const latest =

        history[
            history.length-1
        ]
        .front;



        const omission={};



        for(let n=1;n<=35;n++){


            let miss=0;



            for(
                let i=history.length-1;
                i>=0;
                i--
            ){


                if(
                    history[i].front.includes(n)
                ){

                    break;

                }


                miss++;


            }



            omission[n]=miss;


        }



        return omission;


    }





    // 热冷分析

    hotColdAnalysis(history){


        const count={};



        for(const item of history){


            for(const n of item.front){


                count[n]=

                (count[n]||0)+1;


            }


        }



        const sorted=

        Object.entries(count)
        .sort(
            (a,b)=>b[1]-a[1]
        );



        return {


            hot:

            sorted
            .slice(0,10),


            cold:

            sorted
            .slice(-10)


        };


    }





    // 后区分析

    backAnalysis(history){


        const latest =

        history[
            history.length-1
        ];



        let odd=0;

        let even=0;



        for(const n of latest.back){


            if(n%2)

                odd++;

            else

                even++;


        }



        return {


            odd,

            even,


            sum:

            latest.back.reduce(
                (a,b)=>a+b,
                0
            )


        };


    }



}


export default Theory;