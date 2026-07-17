// DLT-AI-CORE VIP
// core/prediction_engine.js
//
// 预测引擎 V2
//
// 增加:
// 1.三区过滤
// 2.奇偶过滤
// 3.和值约束
// 4.连号控制
// 5.后区结构控制


import CONFIG from "../config.js";



class PredictionEngine {



    constructor(){

        this.result=[];

    }






    generate(

        modelResult,

        count=10

    ){



        let frontPool =

        this.buildPool(

            modelResult,

            "front"

        );




        let backPool =

        this.buildPool(

            modelResult,

            "back"

        );




        let candidates=[];





        for(

            let i=0;

            i<CONFIG.MONTE_CARLO_TIMES;

            i++

        ){



            let front =

            this.randomPick(

                frontPool,

                5

            );





            let back =

            this.randomPick(

                backPool,

                2

            );





            front.sort(

                (a,b)=>a-b

            );



            back.sort(

                (a,b)=>a-b

            );






            if(

                !this.checkFront(front)

            )

                continue;





            if(

                !this.checkBack(back)

            )

                continue;






            let score =

            this.calculateScore(

                front,

                back,

                modelResult

            );







            candidates.push({



                front,


                back,


                score



            });



        }






        this.result =

        this.unique(

            candidates

        )

        .sort(

            (a,b)=>

            b.score-a.score

        )

        .slice(

            0,

            count

        );





        return this.result;


    }









    buildPool(

        models,

        type

    ){



        let map={};





        Object.values(models)

        .forEach(model=>{



            if(

                !Array.isArray(

                    model[type]

                )

            )

            return;






            model[type]

            .forEach(item=>{



                if(item.number){



                    map[item.number]=

                    (

                        map[item.number]

                        ||

                        0

                    )

                    +

                    item.score;



                }



            });



        });







        return Object.keys(map)

        .map(num=>({



            number:Number(num),


            score:map[num]



        }))

        .sort(

            (a,b)=>

            b.score-a.score

        )

        .slice(

            0,

            type==="front"

            ?

            30

            :

            12

        );


    }









    randomPick(

        pool,

        size

    ){



        let copy=[...pool];


        let result=[];





        while(

            result.length<size

        ){



            let total=

            copy.reduce(

                (a,b)=>

                a+b.score,

                0

            );





            let r=

            Math.random()

            *

            total;





            for(

                let i=0;

                i<copy.length;

                i++

            ){



                r-=copy[i].score;



                if(

                    r<=0

                ){



                    result.push(

                        copy[i].number

                    );



                    copy.splice(

                        i,

                        1

                    );



                    break;


                }



            }



        }




        return result;


    }









    // =====================
    // 前区结构过滤
    // =====================

    checkFront(nums){



        let zone=[0,0,0];

        let odd=0;






        nums.forEach(n=>{



            if(n<=12)

                zone[0]++;


            else if(n<=24)

                zone[1]++;


            else

                zone[2]++;





            if(n%2)

                odd++;



        });






        //三区不能极端

        if(

            Math.max(...zone)>=4

        )

        return false;





        //奇偶控制

        if(

            odd===0

            ||

            odd===5

        )

        return false;






        let sum=

        nums.reduce(

            (a,b)=>a+b,

            0

        );





        if(

            sum<60

            ||

            sum>150

        )

        return false;






        //最多两个连号

        let link=0;



        for(

            let i=1;

            i<nums.length;

            i++

        ){



            if(

                nums[i]-nums[i-1]===1

            )

            link++;



        }



        if(

            link>2

        )

        return false;






        return true;


    }









    // =====================
    // 后区过滤
    // =====================

    checkBack(nums){



        if(

            nums[0]===nums[1]

        )

        return false;





        // 避免长期极端小号

        if(

            nums[0]<=3

            &&

            nums[1]<=3

        )

        return false;





        return true;


    }









    calculateScore(

        front,

        back,

        models

    ){



        let score=0;


        let max=0;






        Object.values(models)

        .forEach(model=>{



            ["front","back"]

            .forEach(type=>{



                if(

                    !Array.isArray(

                        model[type]

                    )

                )

                return;






                model[type]

                .forEach(item=>{



                    max +=

                    item.score || 0;





                    if(

                        front.includes(item.number)

                        ||

                        back.includes(item.number)

                    )

                    score +=

                    item.score || 0;



                });



            });



        });







        if(max===0)

            return 0;






        return Number(

            (

            score/max*100

            )

            .toFixed(2)

        );


    }









    unique(list){



        let map={};


        let result=[];




        list.forEach(item=>{



            let key=

            item.front.join("-")

            +

            "|"

            +

            item.back.join("-");





            if(

                !map[key]

            ){



                map[key]=true;


                result.push(item);



            }



        });





        return result;


    }



}





export default new PredictionEngine();