window.V110_MODELS={




// =========================
// 频率模型
// =========================


frequency(number,history){


    let count=0;



    history.forEach(item=>{


        if(
            item.front.includes(number)
        ){

            count++;

        }


    });



    return count/history.length;



},







// =========================
// 趋势模型
// =========================


trend(number,history){



    let recent=

    history.slice(-50);



    let count=0;



    recent.forEach(item=>{


        if(
            item.front.includes(number)
        ){

            count++;

        }


    });



    return count/recent.length;



},







// =========================
// 遗漏模型
// =========================


missing(number,history){



    let miss=0;




    for(
        let i=history.length-1;
        i>=0;
        i--
    ){


        if(
            history[i]
            .front
            .includes(number)
        ){

            break;

        }


        miss++;

    }






    if(
        miss>=5 &&
        miss<=20
    ){

        return 0.8;

    }





    if(
        miss>20
    ){

        return 0.6;

    }



    return 0.5;



},







// =========================
// Bayes概率更新
// =========================


bayes(number,history){



    let f=

    this.frequency(
        number,
        history
    );



    let t=

    this.trend(
        number,
        history
    );




    return (

        f*0.4

        +

        t*0.6

    );



},







// =========================
// Markov转移
// =========================


markov(number,history){



    if(
        history.length<2
    ){

        return 0;

    }



    let last=

    history[
        history.length-1
    ];



    let before=

    history[
        history.length-2
    ];




    let score=0;




    if(
        before.front.includes(number)
    ){

        score+=0.3;

    }




    if(
        last.front.includes(number)
    ){

        score+=0.5;

    }




    return score;



},







// =========================
// 号码共现矩阵
// =========================


matrix(number,history){



    let total=0;



    let count=0;




    history.forEach(item=>{



        if(
            item.front.includes(number)
        ){



            item.front.forEach(n=>{



                if(
                    n!==number
                ){


                    total+=n;

                    count++;


                }


            });


        }


    });





    if(
        count===0
    ){

        return 0;

    }




    return total/count/35;



},







// =========================
// 大乐透理论结构
// =========================


theory(front){



    let score=1;



    // 奇偶

    let odd=

    front.filter(

        n=>n%2===1

    ).length;





    if(
        odd===0 ||
        odd===5
    ){

        score-=0.2;

    }





    // 和值


    let sum=

    front.reduce(

        (a,b)=>a+b,

        0

    );




    if(
        sum>=80 &&
        sum<=130
    ){

        score+=0.1;

    }







    // 三区


    let a=0;

    let b=0;

    let c=0;



    front.forEach(n=>{


        if(n<=12)

            a++;


        else if(n<=24)

            b++;


        else

            c++;


    });






    if(
        a>0 &&
        b>0 &&
        c>0
    ){

        score+=0.1;

    }





    return score;



},







// =========================
// 反人类选号
// =========================


antiHuman(front){



    let score=1;



    // 避免全小号



    if(
        front.every(
            n=>n<=20
        )
    ){

        score-=0.2;

    }




    // 避免生日集中



    let small=

    front.filter(

        n=>n<=31

    ).length;




    if(
        small===5
    ){

        score-=0.1;

    }




    // 避免明显连号



    for(
        let i=0;
        i<4;
        i++
    ){


        if(
            front[i+1]-front[i]===1
        ){

            score-=0.05;

        }


    }




    return score;



},







// =========================
// 单号综合评分
// =========================


score(number,history){



    return (



        this.frequency(
            number,
            history
        )

        *

        0.2




        +



        this.trend(
            number,
            history
        )

        *

        0.2




        +



        this.missing(
            number,
            history
        )

        *

        0.15





        +



        this.bayes(
            number,
            history
        )

        *

        0.15





        +



        this.markov(
            number,
            history
        )

        *

        0.15





        +



        this.matrix(
            number,
            history
        )

        *

        0.1




    );



}





};