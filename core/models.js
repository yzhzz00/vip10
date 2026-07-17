// DLT-AI-CORE V11 FINAL
// core/models.js
// AI模型集合
// frequency / trend / bayes / markov / montecarlo


import config from "../config.js";


class Models {


    run(history){


        return {


            frequency:

            this.frequency(history),



            trend:

            this.trend(history),



            bayes:

            this.bayes(history),



            markov:

            this.markov(history),



            montecarlo:

            this.montecarlo(history)



        };


    }







    // =====================
    // 频率模型
    // =====================

    frequency(history){


        const map={};



        history.forEach(item=>{


            item.front.forEach(n=>{


                map[n]=

                (map[n]||0)+1;


            });


        });



        return this.sort(map);


    }







    // =====================
    // 趋势模型
    // 最近50期
    // =====================

    trend(history){


        const map={};



        const recent =

        history.slice(-50);



        recent.forEach(item=>{


            item.front.forEach(n=>{


                map[n]=

                (map[n]||0)+1;


            });


        });



        return this.sort(map);


    }







    // =====================
    // 贝叶斯模型
    // 平滑概率
    // =====================

    bayes(history){


        const total =

        history.length * 5;



        const map={};



        history.forEach(item=>{


            item.front.forEach(n=>{


                map[n]=

                (map[n]||0)+1;


            });


        });




        const result={};



        for(
            let n=1;

            n<=35;

            n++
        ){


            result[n]=


            (

                (map[n]||0)+1

            )

            /

            (

                total+35

            );



        }



        return this.sort(result);


    }







    // =====================
    // 马尔可夫
    // 上一期→下一期
    // =====================

    markov(history){


        const map={};



        for(
            let i=1;

            i<history.length;

            i++
        ){


            const prev=

            history[i-1].front;



            const next=

            history[i].front;



            prev.forEach(a=>{


                if(!map[a])

                    map[a]={};



                next.forEach(b=>{


                    map[a][b]=

                    (map[a][b]||0)+1;


                });



            });



        }





        const result={};



        for(
            const key in map
        ){


            for(
                const n in map[key]
            ){


                result[n]=

                (result[n]||0)

                +

                map[key][n];


            }


        }



        return this.sort(result);


    }








    // =====================
    // 蒙特卡罗
    // =====================

    montecarlo(history){


        const score={};



        for(
            let i=1;

            i<=35;

            i++
        ){

            score[i]=0;

        }




        const times =

        config.compute.montecarloTimes;



        for(
            let i=0;

            i<times;

            i++
        ){



            let pick =

            Math.floor(

                Math.random()*35

            )

            +

            1;



            score[pick]++;



        }




        return this.sort(score);


    }







    // =====================
    // 排序
    // =====================

    sort(map){


        return Object.entries(map)

        .sort(

            (a,b)=>

            Number(b[1])

            -

            Number(a[1])

        );



    }



}



export default Models;