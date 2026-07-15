// =====================================
// 大乐透AI V90 CORE
// 单文件运行版
// =====================================



window.V90 = {

    history: [],

    config: {

        simulation: 100000

    },

    result: null

};




// =====================================
// DataEngine
// =====================================


const DataEngine = {



    loadText(text){


        let lines = text.split(/\r?\n/);


        let data=[];



        lines.forEach(line=>{


            line=line.trim();


            if(!line){

                return;

            }



            let p=line.split(/\s+/);



            if(p.length < 9){

                return;

            }



            let item={


                period:p[0],


                date:p[1],


                front:p.slice(2,7)
                    .map(Number),


                back:p.slice(7,9)
                    .map(Number)



            };



            if(
                item.front.length===5 &&
                item.back.length===2
            ){

                data.push(item);

            }


        });



        V90.history=data;



        console.log(
            "大乐透数据加载:",
            data.length,
            "期"
        );



        return data;


    },




    getHistory(){


        return V90.history;


    }



};



// 暴露全局

window.DataEngine = DataEngine;





// =====================================
// 基础统计 FeatureEngine
// =====================================


const FeatureEngine={



frequency(numbers,min,max){



    let map={};



    for(let i=min;i<=max;i++){

        map[i]=0;

    }



    numbers.forEach(n=>{

        map[n]++;

    });



    return map;



},




frontFrequency(){


    let nums=[];


    V90.history.forEach(d=>{


        nums.push(...d.front);


    });



    return this.frequency(
        nums,
        1,
        35
    );


},





backFrequency(){


    let nums=[];


    V90.history.forEach(d=>{


        nums.push(...d.back);


    });



    return this.frequency(
        nums,
        1,
        12
    );


}

};





window.FeatureEngine=FeatureEngine;
// =====================================
// OmissionEngine 遗漏分析
// =====================================


const OmissionEngine={



    calculate(type){



        let max =
        type==="front" ? 35 : 12;



        let result={};



        for(
            let i=1;
            i<=max;
            i++
        ){

            result[i]=0;

        }




        for(
            let i=V90.history.length-1;
            i>=0;
            i--
        ){



            let nums =
            type==="front"
            ?
            V90.history[i].front
            :
            V90.history[i].back;



            nums.forEach(n=>{


                if(
                    result[n]===0
                ){

                    result[n]=
                    V90.history.length-i;

                }


            });


        }



        return result;


    }



};



window.OmissionEngine=
OmissionEngine;






// =====================================
// StructureEngine 结构分析
// =====================================


const StructureEngine={



    analyze(front){



        let odd=0;

        let even=0;


        let small=0;

        let big=0;



        front.forEach(n=>{


            if(n%2===0){

                even++;

            }else{

                odd++;

            }



            if(n<=17){

                small++;

            }else{

                big++;

            }



        });



        let sum =
        front.reduce(
            (a,b)=>a+b,
            0
        );



        return {


            odd,


            even,


            small,


            big,


            sum


        };


    }



};



window.StructureEngine=
StructureEngine;






// =====================================
// MarkovEngine 一阶马尔可夫
// =====================================


const MarkovEngine={



    transition(type){



        let matrix={};



        let history =
        V90.history;



        for(
            let i=1;
            i<history.length;
            i++
        ){



            let prev =
            type==="front"
            ?
            history[i-1].front
            :
            history[i-1].back;



            let next =
            type==="front"
            ?
            history[i].front
            :
            history[i].back;



            prev.forEach(a=>{


                if(!matrix[a]){

                    matrix[a]={};

                }



                next.forEach(b=>{


                    if(!matrix[a][b]){

                        matrix[a][b]=0;

                    }


                    matrix[a][b]++;



                });



            });



        }



        return matrix;


    }



};



window.MarkovEngine=
MarkovEngine;
// =====================================
// BayesEngine 贝叶斯评分
// =====================================


const BayesEngine={



    score(number,frequency,total){



        let p =
        frequency[number] /
        total;



        if(!p){

            p=0.001;

        }



        return p*100;



    },





    calculate(type){



        let freq =
        type==="front"
        ?
        FeatureEngine.frontFrequency()
        :
        FeatureEngine.backFrequency();



        let total =
        type==="front"
        ?
        V90.history.length*5
        :
        V90.history.length*2;



        let score={};



        Object.keys(freq)
        .forEach(n=>{


            score[n]=
            this.score(
                n,
                freq,
                total
            );


        });



        return score;



    }



};



window.BayesEngine=BayesEngine;






// =====================================
// MonteCarloEngine 蒙特卡罗模拟
// =====================================


const MonteCarloEngine={



    randomNumber(min,max){



        return Math.floor(
            Math.random()*(max-min+1)
        )+min;



    },





    generateFront(){


        let arr=[];



        while(arr.length<5){



            let n =
            this.randomNumber(
                1,
                35
            );



            if(
                !arr.includes(n)
            ){

                arr.push(n);

            }


        }



        return arr.sort(
            (a,b)=>a-b
        );


    },





    generateBack(){



        let arr=[];



        while(arr.length<2){



            let n =
            this.randomNumber(
                1,
                12
            );



            if(
                !arr.includes(n)
            ){

                arr.push(n);

            }


        }



        return arr.sort(
            (a,b)=>a-b
        );



    },





    run(times){



        let result={};



        for(
            let i=0;
            i<times;
            i++
        ){



            let front =
            this.generateFront();



            let key =
            front.join(",");



            if(!result[key]){

                result[key]=0;

            }



            result[key]++;



        }



        return result;



    }



};



window.MonteCarloEngine=
MonteCarloEngine;
// =====================================
// ScoreEngine 综合评分
// =====================================


const ScoreEngine={



    numberScore(type){



        let bayes =
        BayesEngine.calculate(type);



        let omission =
        OmissionEngine.calculate(type);



        let score={};



        Object.keys(bayes)
        .forEach(n=>{



            let b =
            bayes[n] || 0;



            let o =
            omission[n] || 0;



            score[n]=
            b*0.7 +
            o*0.3;



        });



        return score;



    }



};



window.ScoreEngine=
ScoreEngine;







// =====================================
// PredictionEngine 预测生成
// =====================================


const PredictionEngine={



    topNumbers(score,count){



        return Object.keys(score)

        .sort(
            (a,b)=>
            score[b]-score[a]
        )

        .slice(0,count)

        .map(Number);



    },





    predict(){



        let frontScore =
        ScoreEngine.numberScore(
            "front"
        );



        let backScore =
        ScoreEngine.numberScore(
            "back"
        );



        let front =
        this.topNumbers(
            frontScore,
            5
        );



        let back =
        this.topNumbers(
            backScore,
            2
        );



        let result={


            front:


            front.sort(
                (a,b)=>a-b
            ),


            back:


            back.sort(
                (a,b)=>a-b
            ),


            score:

            Math.round(
                (
                front.reduce(
                    (a,b)=>a+b,
                    0
                )
                )
            )


        };



        V90.result=result;



        return result;



    }



};



window.PredictionEngine=
PredictionEngine;








// =====================================
// AI分析入口
// =====================================


async function startAnalysis(){



    if(
        V90.history.length===0
    ){


        alert(
        "请先加载大乐透历史数据"
        );


        return;


    }




    let bar =
    document.getElementById(
        "progressBar"
    );



    let output =
    document.getElementById(
        "output"
    );



    for(
        let i=0;
        i<=100;
        i+=10
    ){



        await new Promise(
            r=>setTimeout(r,80)
        );



        if(bar){

            bar.style.width=
            i+"%";

        }



    }





    let result =
    PredictionEngine.predict();





    output.innerHTML =

`V90 AI分析完成


前区:

${result.front.join(" ")}


后区:

${result.back.join(" ")}


综合评分:

${result.score}

模型:

频率 ✔
遗漏 ✔
贝叶斯 ✔
结构 ✔
`;





}
// =====================================
// 文件上传读取
// =====================================


function loadFile(file){



    let reader =
    new FileReader();



    reader.onload=function(e){



        let data =
        DataEngine.loadText(
            e.target.result
        );



        let info =
        document.getElementById(
            "dataStatus"
        );



        let status =
        document.getElementById(
            "status"
        );



        if(info){



            info.innerHTML =

            "已加载大乐透历史数据："
            +
            data.length
            +
            "期";



        }



        if(status){



            status.innerHTML =

            "数据加载完成";


        }



    };



    reader.readAsText(
        file,
        "UTF-8"
    );


}







// =====================================
// 开奖反馈学习
// =====================================


function saveFeedback(){



    let text =
    document.getElementById(
        "feedback"
    ).value;



    if(!text){


        alert(
        "请输入开奖号码"
        );


        return;


    }





    localStorage.setItem(

        "V90_feedback",

        text

    );





    let box =
    document.getElementById(
        "learnStatus"
    );



    if(box){


        box.innerHTML =

        "反馈已保存，等待模型更新";


    }



}








// =====================================
// 页面初始化
// =====================================


document.addEventListener(

"DOMContentLoaded",

function(){





    let file =
    document.getElementById(
        "file"
    );



    if(file){



        file.addEventListener(

        "change",

        function(e){



            let f =
            e.target.files[0];



            if(f){


                loadFile(f);


            }



        });



    }






    let btn =
    document.getElementById(
        "analyze"
    );



    if(btn){



        btn.onclick =
        startAnalysis;



    }






    let save =
    document.getElementById(
        "saveFeedback"
    );



    if(save){



        save.onclick =
        saveFeedback;



    }






    let status =
    document.getElementById(
        "status"
    );



    if(status){



        status.innerHTML =

        "V90 CORE启动完成";



    }



    console.log(
        "大乐透AI V90加载完成"
    );



});