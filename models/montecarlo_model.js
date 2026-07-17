class MonteCarloModel {



    constructor(){


        this.status={


            running:false,


            progress:0,


            current:0,


            total:1000000,


            message:"等待"


        };


    }








    async run(candidatePool){



        this.status.running=true;


        this.status.progress=0;


        this.status.current=0;


        this.status.message=

        "蒙特卡罗计算中";





        let total=1000000;



        let block=100000;





        let result={};





        candidatePool.forEach(item=>{


            let key=

            item.front.join(",");



            result[key]=0;



        });






        let keys=

        Object.keys(result);







        for(

            let step=0;

            step<10;

            step++

        ){





            for(

                let i=0;

                i<block;

                i++

            ){



                let index=

                Math.floor(

                    Math.random()*keys.length

                );



                let key=

                keys[index];



                result[key]++;



            }





            this.status.current=

            (step+1)*block;



            this.status.progress=

            Math.floor(

                this.status.current

                /

                total

                *

                100

            );






            await this.delay(100);



        }








        let ranking=

        Object.keys(result)

        .map(k=>({


            front:

            k.split(",").map(Number),



            probability:

            result[k]/total*100



        }))

        .sort(

            (a,b)=>

            b.probability-

            a.probability

        );








        this.status.running=false;


        this.status.progress=100;


        this.status.message=

        "计算完成";





        return ranking.slice(0,10);



    }









    delay(ms){


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





export default new MonteCarloModel();