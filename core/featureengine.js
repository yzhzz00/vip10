// 大乐透AI_V90
// Feature Engine
// 历史特征分析引擎


window.FeatureEngine = {


    history: [],



    init(data){


        this.history=data || [];


        console.log(
            "FeatureEngine初始化"
        );


    },







    // 总分析入口


    analyze(){



        return {


            frequency:
            this.frequency(),



            hotCold:
            this.hotCold(),



            omission:
            this.omission(),



            structure:
            this.structure(),



            sum:
            this.sumAnalysis(),



            span:
            this.spanAnalysis(),



            tail:
            this.tailAnalysis()



        };



    },









    // ===================
    // 号码频率
    // ===================


    frequency(){



        let front={};

        let back={};



        this.history.forEach(
            item=>{


                item.front.forEach(
                    n=>{

                        front[n]=
                        (front[n]||0)+1;

                    }
                );



                item.back.forEach(
                    n=>{

                        back[n]=
                        (back[n]||0)+1;

                    }
                );


            }
        );



        return {

            front,

            back

        };


    },









    // ===================
    // 热冷分析
    // ===================


    hotCold(){



        let freq =
        this.frequency();



        return {


            hotFront:

            this.sortObject(
                freq.front
            ),



            hotBack:

            this.sortObject(
                freq.back
            )


        };


    },









    // ===================
    // 遗漏分析
    // ===================


    omission(){



        let front={};

        let back={};



        for(
            let i=1;i<=35;i++
        ){

            front[i]=null;

        }



        for(
            let i=1;i<=12;i++
        ){

            back[i]=null;

        }




        for(
            let index=
            this.history.length-1;

            index>=0;

            index--
        ){


            let item=
            this.history[index];



            item.front.forEach(
                n=>{


                    if(
                        front[n]===null
                    ){

                        front[n]=
                        this.history.length
                        -1-index;

                    }


                }
            );



            item.back.forEach(
                n=>{


                    if(
                        back[n]===null
                    ){

                        back[n]=
                        this.history.length
                        -1-index;

                    }


                }
            );


        }



        return {

            front,

            back

        };


    },









    // ===================
    // 结构分析
    // ===================


    structure(){



        let result=[];



        this.history.forEach(
            item=>{


                result.push({


                    odd:

                    item.front.filter(
                        n=>n%2!==0
                    ).length,



                    even:

                    item.front.filter(
                        n=>n%2===0
                    ).length



                });


            }
        );



        return result;


    },









    // ===================
    // 和值
    // ===================


    sumAnalysis(){



        return this.history.map(
            item=>{


                return item.front.reduce(
                    (
                        a,b
                    )=>a+b,
                    0
                );


            }
        );


    },









    // ===================
    // 跨度
    // ===================


    spanAnalysis(){



        return this.history.map(
            item=>{


                return Math.max(
                    ...item.front
                )
                -
                Math.min(
                    ...item.front
                );


            }
        );


    },









    // ===================
    // 尾数
    // ===================


    tailAnalysis(){



        let result=[];



        this.history.forEach(
            item=>{


                result.push(

                    item.front.map(
                        n=>n%10
                    )

                );


            }
        );



        return result;


    },









    // 排序辅助


    sortObject(obj){



        return Object.entries(obj)

        .sort(
            (
                a,b
            )=>
            b[1]-a[1]
        );



    }




};