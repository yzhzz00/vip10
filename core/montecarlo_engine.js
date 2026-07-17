// DLT-AI-CORE VIP
// montecarlo_engine.js
// 分段蒙特卡罗引擎


class MonteCarloEngine {


    constructor(){


        this.status={

            running:false,

            percent:0,

            current:0,

            total:1000000,

            message:"等待分析"

        };


        this.result=null;


    }







    async start(){


        if(this.status.running){

            return this.result;

        }



        this.status.running=true;

        this.status.percent=0;

        this.status.current=0;

        this.status.message="开始计算";




        let frontCount={};

        let backCount={};




        for(let i=1;i<=35;i++){

            frontCount[i]=0;

        }



        for(let i=1;i<=12;i++){

            backCount[i]=0;

        }





        let total=1000000;

        let block=100000;






        for(

            let b=0;

            b<10;

            b++

        ){



            for(

                let i=0;

                i<block;

                i++

            ){



                let front=

                this.randomNumbers(

                    35,

                    5

                );



                let back=

                this.randomNumbers(

                    12,

                    2

                );






                front.forEach(n=>{

                    frontCount[n]++;

                });





                back.forEach(n=>{

                    backCount[n]++;

                });



            }






            this.status.current=

            (b+1)*block;



            this.status.percent=

            Math.floor(

                this.status.current

                /

                total

                *

                100

            );



            this.status.message=

            "蒙特卡罗计算中";






            await this.sleep(100);



        }






        this.result={


            front:

            this.sort(frontCount),



            back:

            this.sort(backCount)



        };





        this.status.running=false;

        this.status.percent=100;

        this.status.message="计算完成";




        return this.result;


    }








    randomNumbers(max,count){



        let arr=[];



        while(

            arr.length<count

        ){



            let n=

            Math.floor(

                Math.random()*max

            )+1;





            if(

                !arr.includes(n)

            ){

                arr.push(n);

            }



        }



        return arr;


    }








    sort(data){



        return Object.keys(data)

        .map(n=>({


            number:Number(n),


            score:data[n]


        }))

        .sort(

            (a,b)=>

            b.score-a.score

        );


    }







    sleep(ms){


        return new Promise(

            resolve=>

            setTimeout(

                resolve,

                ms

            )

        );


    }







    getStatus(){


        return this.status;


    }



}




export default new MonteCarloEngine();