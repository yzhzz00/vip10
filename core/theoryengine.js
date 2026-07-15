// 大乐透AI_V90
// Theory Engine
// 大乐透理论分析引擎


window.TheoryEngine = {


    rules:{},

    structure:{},

    theory:{},

    loaded:false,





    // 初始化


    async init(){


        await this.loadTheory();


        this.loaded=true;


        console.log(
            "大乐透理论模块加载完成"
        );


    },







    // 加载理论数据


    async loadTheory(){



        try{


            let theory =
            await fetch(
                "data/theory/theory.json"
            );


            let rules =
            await fetch(
                "data/theory/rules.json"
            );


            let structure =
            await fetch(
                "data/theory/structure.json"
            );



            this.theory =
            await theory.json();



            this.rules =
            await rules.json();



            this.structure =
            await structure.json();



        }catch(e){


            console.warn(
                "理论文件未加载，使用默认规则"
            );



            this.loadDefault();



        }



    },









    // 默认大乐透理论


    loadDefault(){



        this.rules={


            frontCount:5,

            backCount:2,


            frontMax:35,

            backMax:12



        };



        this.structure={


            oddEven:true,

            area:true,

            sum:true,

            span:true



        };



    },









    // =====================
    // 理论综合分析
    // =====================


    analyze(data){



        return {


            structure:

            this.structureScore(
                data
            ),



            rule:

            this.ruleCheck(
                data
            ),



            repeat:

            this.repeatAnalysis(
                data
            ),



            area:

            this.areaAnalysis(
                data
            )



        };



    },









    // =====================
    // 结构评分
    // =====================


    structureScore(item){



        let score=100;



        let front=item.front;



        let odd =
        front.filter(
            n=>n%2!==0
        ).length;



        let even =
        front.length-odd;



        // 奇偶偏离扣分


        if(
            Math.abs(
                odd-even
            )>3
        ){

            score-=15;

        }





        let sum =
        front.reduce(
            (
                a,b
            )=>a+b,
            0
        );



        // 和值范围


        if(
            sum<50 ||
            sum>170
        ){

            score-=20;

        }




        return Math.max(
            score,
            0
        );


    },









    // =====================
    // 规则检查
    // =====================


    ruleCheck(item){



        let result={


            pass:true,


            errors:[]


        };



        if(
            item.front.length!==5
        ){


            result.pass=false;


            result.errors.push(
                "前区数量错误"
            );


        }



        if(
            item.back.length!==2
        ){


            result.pass=false;


            result.errors.push(
                "后区数量错误"
            );


        }



        return result;



    },









    // =====================
    // 重号分析
    // =====================


    repeatAnalysis(item,last){



        if(!last){

            return 0;

        }



        let count=0;



        item.front.forEach(
            n=>{


                if(
                    last.front.includes(n)
                ){

                    count++;

                }


            }
        );



        return count;


    },









    // =====================
    // 区间分析
    // =====================


    areaAnalysis(item){



        let area=[0,0,0,0,0];



        item.front.forEach(
            n=>{


                if(n<=7)
                    area[0]++;


                else if(n<=14)
                    area[1]++;


                else if(n<=21)
                    area[2]++;


                else if(n<=28)
                    area[3]++;


                else
                    area[4]++;


            }
        );



        return area;


    }






};