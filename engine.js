// ======================================
// 彩票智能分析系统 V35.8
// engine.js
// Part 1/5
// 大乐透底层分析引擎
// ======================================


const DLTEngine = {


    data: [],

    frontScore: {},

    backScore: {},

    markov: {},



    // ==============================
    // 初始化
    // ==============================

    init(data){


        this.data=data || [];


        this.frontScore={};

        this.backScore={};

        this.markov={};



        this.initNumber();



        this.frequencyModel();


        this.omissionModel();


        this.hotColdModel();


        this.markovModel();



        this.normalize();



    },





    // ==============================
    // 初始化号码
    // ==============================

    initNumber(){



        for(let i=1;i<=35;i++){


            let n=
            String(i).padStart(2,"0");


            this.frontScore[n]=0;


        }



        for(let i=1;i<=12;i++){


            let n=
            String(i).padStart(2,"0");


            this.backScore[n]=0;


        }



    },





    // ==============================
    // 历史频率模型
    // ==============================

    frequencyModel(){



        this.data.forEach(item=>{


            item.front.forEach(n=>{


                this.frontScore[n]+=25;


            });



            item.back.forEach(n=>{


                this.backScore[n]+=25;


            });



        });



    },





    // ==============================
    // 遗漏周期模型
    // ==============================

    omissionModel(){



        Object.keys(this.frontScore)
        .forEach(n=>{


            let miss=0;


            for(let i=this.data.length-1;i>=0;i--){


                if(
                this.data[i].front.includes(n)
                ){


                    break;


                }


                miss++;


            }



            if(miss>=20){


                this.frontScore[n]+=15;


            }
            else if(miss>=10){


                this.frontScore[n]+=8;


            }



        });





        Object.keys(this.backScore)
        .forEach(n=>{


            let miss=0;


            for(let i=this.data.length-1;i>=0;i--){


                if(
                this.data[i].back.includes(n)
                ){


                    break;


                }


                miss++;


            }



            if(miss>=10){


                this.backScore[n]+=10;


            }



        });



    },
    // ======================================
// V35.8 engine.js
// Part 2/5
// 冷热模型 + 马尔可夫转移模型
// ======================================





// ==============================
// 冷热号码模型
// ==============================


hotColdModel(){



    let recent30 =
    this.data.slice(-30);



    let recent100 =
    this.data.slice(-100);





    // 最近30期热度

    recent30.forEach(item=>{


        item.front.forEach(n=>{


            if(this.frontScore[n]!==undefined){


                this.frontScore[n]+=20;


            }


        });



        item.back.forEach(n=>{


            if(this.backScore[n]!==undefined){


                this.backScore[n]+=20;


            }


        });



    });






    // 最近100期趋势


    recent100.forEach(item=>{


        item.front.forEach(n=>{


            if(this.frontScore[n]!==undefined){


                this.frontScore[n]+=10;


            }


        });



        item.back.forEach(n=>{


            if(this.backScore[n]!==undefined){


                this.backScore[n]+=10;


            }


        });



    });





},







// ==============================
// 一阶马尔可夫模型
// 上一期 → 下一期
// ==============================


markovModel(){



    for(let i=1;i<this.data.length;i++){



        let previous =
        this.data[i-1].front;



        let current =
        this.data[i].front;





        previous.forEach(a=>{



            if(!this.markov[a]){


                this.markov[a]={};


            }




            current.forEach(b=>{



                if(!this.markov[a][b]){


                    this.markov[a][b]=0;


                }



                this.markov[a][b]++;



            });



        });



    }






    // 转换成概率


    for(let a in this.markov){



        let total=0;



        for(let b in this.markov[a]){


            total+=this.markov[a][b];


        }





        for(let b in this.markov[a]){



            this.markov[a][b]
            =
            this.markov[a][b]
            /
            total;



        }



    }



},







// ==============================
// 根据上一期修正号码概率
// ==============================


markovAdjust(lastDraw){



    if(!lastDraw)
    return;





    lastDraw.forEach(a=>{



        let next =
        this.markov[a];





        if(!next)
        return;





        for(let n in next){



            this.frontScore[n]
            +=
            next[n]*20;



        }




    });



},







// ==============================
// 标准化评分
// ==============================


normalize(){



    this.normalizeObject(
        this.frontScore
    );



    this.normalizeObject(
        this.backScore
    );



},







normalizeObject(obj){



    let values =
    Object.values(obj);




    let max =
    Math.max(...values);



    let min =
    Math.min(...values);





    for(let k in obj){



        if(max===min){



            obj[k]=50;



        }
        else{


            obj[k]
            =
            (
            (obj[k]-min)
            /
            (max-min)
            )
            *
            100;



        }



    }



},
// ======================================
// V35.8 engine.js
// Part 3/5
// 组合生成 + 结构过滤
// ======================================




// ==============================
// 生成候选组合
// ==============================


generateCombination(){



    let pool =
    Object.keys(this.frontScore);




    let result=[];




    while(result.length<5){



        let total=0;



        pool.forEach(n=>{


            total+=
            this.frontScore[n]+1;


        });






        let random =
        Math.random()*total;



        let sum=0;





        for(let n of pool){



            sum+=
            this.frontScore[n]+1;





            if(sum>=random){



                if(!result.includes(n)){


                    result.push(n);


                }



                break;


            }



        }



    }







    result.sort(
    (a,b)=>
    Number(a)-Number(b)
    );





    return result;



},







// ==============================
// 组合结构评分
// ==============================


combinationScore(nums){



    let score=0;




    let values =
    nums.map(Number);





    // ----------------------
    // 单号基础评分
    // ----------------------


    nums.forEach(n=>{


        score+=
        this.frontScore[n];


    });



    score/=5;







    // ----------------------
    // 奇偶结构
    // ----------------------


    let odd =
    values.filter(
    n=>n%2===1
    ).length;





    if(
    odd===2 ||
    odd===3
    ){


        score+=8;


    }








    // ----------------------
    // 三区结构
    // ----------------------


    let zone1=0;

    let zone2=0;

    let zone3=0;




    values.forEach(n=>{


        if(n<=12){


            zone1++;


        }
        else if(n<=24){


            zone2++;


        }
        else{


            zone3++;


        }


    });







    if(
    zone1>0 &&
    zone2>0 &&
    zone3>0
    ){


        score+=10;


    }








    // ----------------------
    // 和值
    // ----------------------


    let sum =
    values.reduce(
    (a,b)=>a+b,
    0
    );





    if(
    sum>=80 &&
    sum<=170
    ){


        score+=8;


    }







    // ----------------------
    // 跨度
    // ----------------------


    let span =
    values[4]-values[0];





    if(
    span>=15 &&
    span<=32
    ){


        score+=5;


    }








    // ----------------------
    // 连号控制
    // ----------------------


    let consecutive=0;



    for(
    let i=1;
    i<values.length;
    i++
    ){



        if(
        values[i]
        -
        values[i-1]
        ===1
        ){


            consecutive++;


        }



    }






    if(
    consecutive<=2
    ){


        score+=3;


    }






    return score;



},







// ==============================
// 重复号码过滤
// ==============================


similarCheck(a,b){



    let same=0;



    a.forEach(n=>{



        if(
        b.includes(n)
        ){


            same++;


        }



    });






    return same;



},
// ======================================
// V35.8 engine.js
// Part 4/5
// 蒙特卡罗筛选 + 后区模型 + 三方案
// ======================================





// ==============================
// 蒙特卡罗搜索
// ==============================


monteCarlo(times=100000){



    let candidates=[];



    for(
    let i=0;
    i<times;
    i++
    ){



        let nums =
        this.generateCombination();





        let score =
        this.combinationScore(nums);






        candidates.push({



            nums:nums,

            score:score



        });





    }






    // 排序


    candidates.sort(
    (a,b)=>
    b.score-a.score
    );






    let results=[];






    for(let item of candidates){



        let duplicate=false;





        for(let old of results){



            let same =
            this.similarCheck(
            item.nums,
            old.nums
            );





            // 三个以上重复取消

            if(same>=3){



                duplicate=true;



            }




        }





        if(!duplicate){



            results.push(item);



        }





        if(results.length>=3){


            break;


        }



    }





    return results;



},







// ==============================
// 后区生成
// ==============================


generateBack(){



    let pool =
    Object.keys(this.backScore);




    let result=[];





    while(result.length<2){



        let total=0;



        pool.forEach(n=>{



            total+=
            this.backScore[n]+1;



        });







        let r=
        Math.random()*total;



        let sum=0;





        for(let n of pool){



            sum+=
            this.backScore[n]+1;





            if(sum>=r){



                if(!result.includes(n)){



                    result.push(n);



                }



                break;



            }



        }



    }







    result.sort(
    (a,b)=>
    Number(a)-Number(b)
    );






    return result;



},







// ==============================
// 添加后区评分
// ==============================


addBackToPlans(plans){



    return plans.map((item,index)=>{



        return {



            front:item.nums,

            back:
            this.generateBack(),

            score:
            this.finalScore(
            item.score
            )



        };



    });



},







// ==============================
// 最终评分
// ==============================


finalScore(score){



    let value =
    Math.round(score);






    if(value>100){



        value=100;



    }




    if(value<60){



        value=60;



    }




    return value;



},
// ======================================
// V35.8 engine.js
// Part 5/5
// 主入口 + 回测 + 输出
// ======================================





// ==============================
// 主运行函数
// ==============================


run(){



    if(
    this.data.length===0
    ){



        return [];



    }






    // 初始化模型


    this.init(this.data);






    // 最近一期修正


    let last =
    this.data[
    this.data.length-1
    ];





    if(last){



        this.markovAdjust(
        last.front
        );



    }






    // 蒙特卡罗


    let result = 
    this.monteCarlo(
    100000
    );






    // 加入后区


    let final =
    this.addBackToPlans(
    result
    );






    return final;



},







// ==============================
// 历史回测接口
// ==============================


backTest(){



    let total =
    this.data.length;



    let hit3=0;

    let hit4=0;

    let hit5=0;





    for(
    let i=100;
    i<total;
    i++
    ){



        let history =
        this.data.slice(
        0,
        i
        );





        this.init(history);





        let result =
        this.monteCarlo(
        5000
        );





        let real =
        this.data[i].front;






        result.forEach(item=>{



            let same =
            this.similarCheck(
            item.nums,
            real
            );





            if(same>=3){


                hit3++;


            }



            if(same>=4){


                hit4++;


            }



            if(same===5){


                hit5++;


            }





        });




    }






    return {



        periods:
        total-100,

        hit3:hit3,

        hit4:hit4,

        hit5:hit5



    };



},







// ==============================
// 获取模型状态
// ==============================


status(){



    return {



        version:
        "V35.8",



        periods:
        this.data.length,



        model:
        "大乐透综合分析引擎"



    };



}





};







// 全局暴露

window.DLTEngine =
DLTEngine;



// ======================================
// V35.8 END
// ======================================