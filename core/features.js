// DLT-AI-CORE VIP
// core/features.js
// 特征工程核心模块
//
// 负责从历史开奖中提取：
// frequency 频率
// trend 趋势
// omission 遗漏
// cycle 周期
// odd_even 奇偶
// zone 三区
// sum 和值
// repeat 重复


class Features {



    constructor(){


        this.maxFront = 35;

        this.maxBack = 12;


    }









    analyze(history){



        if(

            !history

            ||

            history.length===0

        ){



            throw new Error(

                "没有历史数据"

            );


        }






        return {



            frequency:

            this.frequency(history),



            trend:

            this.trend(history),



            omission:

            this.omission(history),



            cycle:

            this.cycle(history),



            oddEven:

            this.oddEven(history),



            zone:

            this.zone(history),



            sum:

            this.sum(history),



            repeat:

            this.repeat(history)



        };



    }









    // ======================
    // 号码出现频率
    // ======================

    frequency(history){



        const count={};



        for(

            let i=1;

            i<=35;

            i++

        ){



            count[i]=0;



        }







        history.forEach(draw=>{



            draw.front.forEach(n=>{



                count[n]++;



            });



        });







        return Object.entries(count)

        .sort(

            (a,b)=>

            b[1]-a[1]

        );



    }









    // ======================
    // 最近趋势
    // ======================

    trend(history){



        const recent =

        history.slice(

            -100

        );





        const count={};



        for(

            let i=1;

            i<=35;

            i++

        ){



            count[i]=0;



        }







        recent.forEach(draw=>{



            draw.front.forEach(n=>{



                count[n]++;



            });



        });







        return Object.entries(count)

        .sort(

            (a,b)=>

            b[1]-a[1]

        );



    }









    // ======================
    // 当前遗漏
    // ======================

    omission(history){



        const result={};



        for(

            let n=1;

            n<=35;

            n++

        ){



            result[n]=0;



        }








        for(

            let i=

            history.length-1;

            i>=0;

            i--

        ){



            const front=

            history[i].front;





            for(

                let n=1;

                n<=35;

                n++

            ){



                if(

                    !front.includes(n)

                ){



                    result[n]++;



                }

                else{



                    break;



                }



            }



        }







        return Object.entries(result)

        .sort(

            (a,b)=>

            b[1]-a[1]

        );



    }









    // ======================
    // 周期特征
    // ======================

    cycle(history){



        const result={};



        for(

            let n=1;

            n<=35;

            n++

        ){



            result[n]=[];

        }








        history.forEach(

            (draw,index)=>{



                draw.front.forEach(n=>{



                    result[n]

                    .push(index);



                });



            }

        );








        const avg={};



        for(

            let n=1;

            n<=35;

            n++

        ){



            const arr=

            result[n];





            if(

                arr.length>1

            ){



                let total=0;



                for(

                    let i=1;

                    i<arr.length;

                    i++

                ){



                    total +=

                    arr[i]

                    -

                    arr[i-1];



                }





                avg[n]=

                total/(arr.length-1);



            }

            else{



                avg[n]=0;



            }



        }







        return Object.entries(avg)

        .sort(

            (a,b)=>

            b[1]-a[1]

        );



    }









    // ======================
    // 奇偶结构
    // ======================

    oddEven(history){



        const result={};



        history.forEach(draw=>{



            const odd =

            draw.front.filter(

                n=>n%2!==0

            ).length;





            result[odd]=

            (result[odd]||0)+1;



        });






        return result;



    }









    // ======================
    // 三区分析
    // ======================

    zone(history){



        const result={



            low:0,

            middle:0,

            high:0



        };







        history.forEach(draw=>{



            draw.front.forEach(n=>{



                if(n<=12)

                result.low++;



                else if(n<=24)

                result.middle++;



                else

                result.high++;



            });



        });







        return result;



    }









    // ======================
    // 和值
    // ======================

    sum(history){



        return history.map(draw=>{



            return draw.front

            .reduce(

                (a,b)=>

                a+b,

                0

            );



        });



    }









    // ======================
    // 重复号码
    // ======================

    repeat(history){



        const result=[];



        for(

            let i=1;

            i<history.length;

            i++

        ){



            const prev=

            history[i-1].front;



            const now=

            history[i].front;





            const same=

            now.filter(

                n=>

                prev.includes(n)

            );





            result.push(

                same.length

            );



        }







        return result;



    }





}



export default Features;