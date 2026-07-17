// DLT-AI-CORE V11 FINAL
// core/models.js
// 多模型预测核心


import config from "../config.js";


class Models {


    constructor(){

        this.models = [

            "frequency",

            "trend",

            "bayes",

            "markov",

            "montecarlo"

        ];

    }





    analyze(history){


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





    // 频率模型

    frequency(history){


        const count={};



        for(const item of history){


            for(const n of item.front){


                count[n]=

                (count[n]||0)+1;


            }


        }



        return this.rank(count);


    }





    // 趋势模型

    trend(history){


        const recent =

        history.slice(-100);



        const count={};



        for(const item of recent){


            for(const n of item.front){


                count[n]=

                (count[n]||0)+1;


            }


        }



        return this.rank(count);


    }





    // 贝叶斯模型

    bayes(history){


        const count={};


        const total =

        history.length;



        for(const item of history){


            for(const n of item.front){


                count[n]=

                (count[n]||0)+1;


            }


        }



        const score={};



        for(let n=1;n<=35;n++){


            const p=

            ((count[n]||0)+1)

            /

            (total+35);



            score[n]=p;


        }



        return this.sort(score);


    }





    // 马尔可夫转移模型

    markov(history){


        const transition={};



        for(
            let i=1;
            i<history.length;
            i++
        ){


            const prev=

            history[i-1].front;



            const next=

            history[i].front;



            for(const a of prev){


                if(!transition[a])

                    transition[a]={};



                for(const b of next){


                    transition[a][b]=

                    (transition[a][b]||0)+1;


                }


            }


        }



        const last=

        history[
            history.length-1
        ].front;



        const score={};



        for(const n of last){


            const map=

            transition[n]||{};



            for(const k in map){


                score[k]=

                (score[k]||0)+map[k];


            }


        }



        return this.sort(score);


    }





    // Monte Carlo模拟

    montecarlo(history){


        const count={};



        for(const item of history){


            for(const n of item.front){


                count[n]=

                (count[n]||0)+1;


            }


        }



        const result={};



        const total=

        config.montecarlo.simulations;



        for(let i=0;i<total;i++){


            const n=

            Math.floor(
                Math.random()*35
            )+1;



            result[n]=

            (result[n]||0)+1;


        }



        return this.sort(result);


    }





    rank(obj){


        return Object.entries(obj)

        .sort(
            (a,b)=>b[1]-a[1]
        )

        .slice(0,20);


    }





    sort(obj){


        return Object.entries(obj)

        .sort(
            (a,b)=>b[1]-a[1]
        )

        .slice(0,20);


    }



}



export default Models;