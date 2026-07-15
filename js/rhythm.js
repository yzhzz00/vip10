window.V110_RHYTHM = {



    // =========================
    // 热号 / 冷号节奏
    // =========================

    hotCold(history){



        let recent =

        history.slice(-30);



        let count={};



        for(
            let i=1;
            i<=35;
            i++
        ){

            count[i]=0;

        }





        recent.forEach(item=>{


            item.front.forEach(n=>{


                count[n]++;


            });



        });






        let hot=[];

        let cold=[];




        Object.keys(count)

        .forEach(n=>{



            if(
                count[n]>=8
            ){

                hot.push(Number(n));


            }



            if(
                count[n]<=2
            ){

                cold.push(Number(n));


            }



        });






        return {

            hot,

            cold

        };



    },









    // =========================
    // 三区轮换
    // =========================

    zones(history){



        let last=

        history.slice(-20);




        let result=[];



        last.forEach(item=>{



            let z={

                one:0,

                two:0,

                three:0

            };




            item.front.forEach(n=>{



                if(n<=12)

                    z.one++;



                else if(n<=24)

                    z.two++;



                else

                    z.three++;



            });




            result.push(z);



        });





        return result;



    },









    // =========================
    // 和值节奏
    // =========================

    sumTrend(history){



        let sums=[];



        history
        .slice(-30)
        .forEach(item=>{


            let s=

            item.front.reduce(

                (a,b)=>a+b,

                0

            );



            sums.push(s);



        });





        let avg=

        sums.reduce(

            (a,b)=>a+b,

            0

        )

        /

        sums.length;




        return {


            recent:sums,


            average:

            avg.toFixed(2)


        };



    },









    // =========================
    // 奇偶节奏
    // =========================

    oddEven(history){



        let result=[];



        history
        .slice(-20)
        .forEach(item=>{



            let odd=

            item.front.filter(

                n=>n%2===1

            ).length;



            result.push(odd);



        });




        return result;



    },









    // =========================
    // 大小节奏
    // =========================

    bigSmall(history){



        let result=[];



        history
        .slice(-20)
        .forEach(item=>{


            let big=

            item.front.filter(

                n=>n>=18

            ).length;



            result.push(big);



        });




        return result;



    },









    // =========================
    // 连号节奏
    // =========================

    consecutive(history){



        let result=[];



        history
        .slice(-30)
        .forEach(item=>{



            let count=0;



            let nums=

            item.front;



            for(
                let i=0;
                i<4;
                i++
            ){


                if(
                    nums[i+1]-nums[i]===1
                ){

                    count++;

                }



            }




            result.push(count);



        });





        return result;



    },









    // =========================
    // 总节奏报告
    // =========================

    report(history){



        return {


            hotCold:

            this.hotCold(history),



            zones:

            this.zones(history),



            sum:

            this.sumTrend(history),



            oddEven:

            this.oddEven(history),



            bigSmall:

            this.bigSmall(history),



            consecutive:

            this.consecutive(history)



        };



    }





};