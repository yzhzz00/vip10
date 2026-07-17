// DLT-AI-CORE VIP
// models/monte_carlo_model.js
//
// 蒙特卡罗模型
//
// 随机模拟组合概率


class MonteCarloModel {



    constructor(){


        this.front=[];


        this.back=[];


        this.times=100000;



    }









    train(history){



        let frontCount={};


        let backCount={};







        for(

            let i=1;

            i<=35;

            i++

        ){



            frontCount[i]=0;



        }







        for(

            let i=1;

            i<=12;

            i++

        ){



            backCount[i]=0;



        }







        for(

            let i=0;

            i<this.times;

            i++

        ){



            let front=

            this.pick(

                35,

                5

            );







            let back=

            this.pick(

                12,

                2

            );







            front.forEach(num=>{



                frontCount[num]++;



            });







            back.forEach(num=>{



                backCount[num]++;



            });



        }








        this.front=

        this.normalize(

            frontCount

        );







        this.back=

        this.normalize(

            backCount

        );








        return true;


    }









    pick(

        max,

        count

    ){



        let arr=[];


        let pool=[];







        for(

            let i=1;

            i<=max;

            i++

        ){



            pool.push(i);



        }







        while(

            arr.length<count

        ){



            let index=

            Math.floor(

                Math.random()

                *

                pool.length

            );







            arr.push(

                pool[index]

            );







            pool.splice(

                index,

                1

            );



        }







        return arr;


    }









    normalize(data){



        let max=

        Math.max(

            ...Object.values(data)

        );







        return Object.keys(data)

        .map(num=>({



            number:Number(num),



            score:

            Number(

                (

                data[num]

                /

                max

                *

                100

                )

                .toFixed(2)

            )



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );



    }









    analyze(){



        return {



            front:this.front,



            back:this.back



        };


    }



}





export default new MonteCarloModel();