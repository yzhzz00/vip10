// DLT-AI-CORE V11 FINAL
// core/theory.js
// 大乐透理论分析模块


class Theory {


    analyze(history){


        if(
            !history ||
            history.length===0
        ){

            return {};

        }



        return {


            zone:

            this.zone(history),



            oddEven:

            this.oddEven(history),



            bigSmall:

            this.bigSmall(history),



            sum:

            this.sum(history),



            ac:

            this.ac(history),



            span:

            this.span(history),



            consecutive:

            this.consecutive(history),



            repeat:

            this.repeat(history),



            omission:

            this.omission(history),



            back:

            this.back(history)



        };


    }







    // =====================
    // 三区分析
    // =====================

    zone(history){


        let result={


            zone1:0,

            zone2:0,

            zone3:0


        };



        history.forEach(item=>{


            item.front.forEach(n=>{


                if(n<=12)

                    result.zone1++;


                else if(n<=24)

                    result.zone2++;


                else

                    result.zone3++;


            });



        });



        return result;


    }







    // =====================
    // 奇偶
    // =====================

    oddEven(history){


        let odd=0;

        let even=0;



        history.forEach(item=>{


            item.front.forEach(n=>{


                n%2===0

                ?

                even++

                :

                odd++;


            });


        });



        return {


            odd,

            even


        };


    }







    // =====================
    // 大小
    // =====================

    bigSmall(history){


        let small=0;

        let big=0;



        history.forEach(item=>{


            item.front.forEach(n=>{


                n<=17

                ?

                small++

                :

                big++;


            });



        });



        return {


            small,

            big


        };


    }








    // =====================
    // 和值
    // =====================

    sum(history){


        let values=[];



        history.forEach(item=>{


            values.push(

                item.front.reduce(

                    (a,b)=>a+b,

                    0

                )

            );


        });



        return {


            average:

            Number(

                (

                values.reduce(

                    (a,b)=>a+b,

                    0

                )

                /

                values.length

                )

                .toFixed(2)

            ),



            latest:

            values[values.length-1]

        };


    }








    // =====================
    // AC值
    // =====================

    ac(history){


        let list=[];



        history.forEach(item=>{


            let nums =

            item.front.sort(

                (a,b)=>a-b

            );



            let diff=[];



            for(
                let i=0;

                i<nums.length;

                i++
            ){


                for(
                    let j=i+1;

                    j<nums.length;

                    j++
                ){


                    diff.push(

                        nums[j]-nums[i]

                    );


                }


            }




            let unique =

            new Set(diff);



            list.push(

                unique.size

                -

                4

            );



        });



        return {


            average:

            Number(

                (

                list.reduce(

                    (a,b)=>a+b,

                    0

                )

                /

                list.length

                )

                .toFixed(2)

            )

        };


    }








    // =====================
    // 跨度
    // =====================

    span(history){


        let list=[];



        history.forEach(item=>{


            let max=

            Math.max(

                ...item.front

            );



            let min=

            Math.min(

                ...item.front

            );



            list.push(

                max-min

            );


        });



        return {


            average:

            Number(

                (

                list.reduce(

                    (a,b)=>a+b,

                    0

                )

                /

                list.length

                )

                .toFixed(2)

            )

        };


    }








    // =====================
    // 连号
    // =====================

    consecutive(history){


        let count=0;



        history.forEach(item=>{


            let nums=

            item.front.sort(

                (a,b)=>a-b

            );



            for(
                let i=0;

                i<4;

                i++
            ){


                if(
                    nums[i+1]-nums[i]===1
                )

                    count++;


            }


        });



        return count;


    }








    // =====================
    // 重号
    // =====================

    repeat(history){


        let count=0;



        for(
            let i=1;

            i<history.length;

            i++
        ){


            history[i].front.forEach(n=>{


                if(

                    history[i-1]

                    .front

                    .includes(n)

                )

                    count++;


            });


        }



        return count;


    }








    // =====================
    // 遗漏
    // =====================

    omission(history){


        let result={};



        for(
            let n=1;

            n<=35;

            n++
        ){


            let miss=0;



            for(
                let i=history.length-1;

                i>=0;

                i--
            ){


                if(

                    history[i]

                    .front

                    .includes(n)

                )

                    break;



                miss++;


            }



            result[n]=miss;


        }



        return result;


    }








    // =====================
    // 后区分析
    // =====================

    back(history){


        let map={};



        history.forEach(item=>{


            item.back.forEach(n=>{


                map[n]=

                (map[n]||0)+1;


            });


        });



        return Object.entries(map)

        .sort(

            (a,b)=>b[1]-a[1]

        );


    }



}



export default Theory;