// ==================================================
// 大乐透 AI V100 CORE FINAL
// montecarlo.js
// 手机优化版蒙特卡罗引擎
// ==================================================

"use strict";


window.V100MonteCarlo = {



    total:100000,


    batch:1000,


    running:false,


    pause:false,


    current:0,



    results:[],






    // ==========================
    // 开始模拟
    // ==========================


    async run(
        candidates
    ){



        this.running=true;

        this.pause=false;

        this.current=0;

        this.results=[];




        let rounds =
        this.total;





        while(
            this.current < rounds
        ){



            // 暂停

            while(this.pause){


                await this.sleep(200);


            }




            if(
                !this.running
            ){

                break;

            }




            let count =

            Math.min(

                this.batch,

                rounds-this.current

            );





            for(
                let i=0;

                i<count;

                i++

            ){



                let item =

                this.pick(
                    candidates
                );



                this.results.push(
                    item
                );



            }





            this.current += count;





            this.updateProgress();






            // 释放手机线程

            await this.sleep(30);



        }







        this.running=false;



        return this.rank();




    },








    // ==========================
    // 随机抽样
    // ==========================


    pick(candidates){



        let index =

        Math.floor(

            Math.random()
            *
            candidates.length

        );



        let item =
        candidates[index];



        return {


            front:
            item.front,


            back:
            item.back,


            score:
            item.score || 0


        };


    },








    // ==========================
    // 排序
    // ==========================


    rank(){



        let map={};




        this.results.forEach(item=>{


            let key=

            item.front.join("-")

            +

            "+"

            +

            item.back.join("-");




            if(
                !map[key]
            ){


                map[key]={

                    front:item.front,

                    back:item.back,

                    count:0,

                    score:item.score

                };


            }



            map[key].count++;




        });






        return Object.values(map)

        .sort(

            (a,b)=>

            b.count-a.count

        )

        .slice(
            0,
            10
        );



    },









    // ==========================
    // 暂停
    // ==========================


    pauseRun(){


        this.pause=true;


    },






    // ==========================
    // 继续
    // ==========================


    continueRun(){


        this.pause=false;


    },







    // ==========================
    // 停止
    // ==========================


    stop(){


        this.running=false;


    },








    // ==========================
    // 进度显示
    // ==========================


    updateProgress(){



        let percent=

        Math.floor(

            this.current
            /
            this.total
            *
            100

        );





        let bar=

        document.getElementById(
            "progressBar"
        );



        let text=

        document.getElementById(
            "progressNumber"
        );





        if(bar){


            bar.style.width =
            percent+"%";


        }





        if(text){


            text.innerHTML=

            `蒙特卡罗：

            ${this.current}

            /

            ${this.total}

            (${percent}%)

            `;


        }



    },









    sleep(ms){


        return new Promise(

            resolve=>

            setTimeout(
                resolve,
                ms
            )

        );


    }





};