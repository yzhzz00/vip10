import {

runDLT,

runPL5

} from "./core/runner.js";


import {

renderDLT,

renderPL5

} from "./web/result.js";




const btn=

document.getElementById(
"analyze"
);



const type=

document.getElementById(
"lottery"
);



const status=

document.getElementById(
"status"
);



const result=

document.getElementById(
"result"
);



btn.onclick=()=>{


    status.innerHTML=
    "AI模型运行中...";


    let data;



    if(type.value==="dlt"){


        data=runDLT();



        result.innerHTML=

        renderDLT(data);


    }

    else{


        data=runPL5();



        result.innerHTML=

        renderPL5(data);


    }



    status.innerHTML=

    `

    数据期数:

    ${data.periods}

    <br>

    模型:

    Bayesian ✓

    Markov ✓

    MonteCarlo ✓

    Genetic ✓

    Fusion ✓

    `;



};





document
.getElementById("save")
.onclick=()=>{


alert(
"反馈已保存，学习模块将在后续接入"
);


};