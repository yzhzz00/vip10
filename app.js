// app.js


import {DataLoader}
from "./core/data.js";


import {TheoryEngine}
from "./core/theories.js";


import {MonteCarloEngine}
from "./core/montecarlo.js";


import {LearningEngine}
from "./core/learning.js";


import {FrequencyModel}
from "./models/frequency.js";


import {BayesModel}
from "./models/bayes.js";


import {MarkovModel}
from "./models/markov.js";


import {MonteModel}
from "./models/monte.js";


import {AntiHumanModel}
from "./models/anti_human.js";


import {TrendAIModel}
from "./models/trend_ai.js";


import {AICommittee}
from "./ai/committee.js";


import {WeightManager}
from "./ai/weights.js";


import {Dashboard}
from "./visual/dashboard.js";


import {LearningMonitor}
from "./visual/monitor.js";





let history=[];

let models=[];

let weights;

let monitor;

let dashboard;





function log(text){


    if(monitor){

        monitor.addLog(text);

    }


}





async function start(){



monitor =
new LearningMonitor(
"monitor"
);



dashboard =
new Dashboard(
"dashboard"
);





log(
"系统启动"
);





// =====================
// 数据读取
// =====================


const loader =
new DataLoader();



history =
await loader.load(

"./data/dlt_history.txt"

);



document
.getElementById("data")
.innerHTML =


`

历史数据:

${history.length}

期

<br>

DLT-AI-CORE V11 已加载

`;



log(
"历史数据加载完成"
);





// =====================
// 模型
// =====================


models=[


new FrequencyModel(),

new BayesModel(),

new MarkovModel(),

new MonteModel(),

new AntiHumanModel(),

new TrendAIModel()


];





models.forEach(
model=>{


log(

"训练:"
+
model.name

);



model.train(
history
);



});





// =====================
// 权重
// =====================


weights =
new WeightManager();



models.forEach(
model=>{


weights.register(
model.name
);


});





const learning =

new LearningEngine(
weights
);





// =====================
// 理论
// =====================


const theory =

new TheoryEngine();





// =====================
// AI委员会
// =====================


const committee =

new AICommittee(
models
);





// =====================
// 蒙特卡罗
// =====================


const monte =

new MonteCarloEngine();



log(
"开始百万模拟"
);





monte.run(

models,

theory,


(progress)=>{


monitor.updateProgress(

progress.toFixed(2)

);



},



(result)=>{


log(
"模拟完成"
);



let top =

committee.predict(

result.map(
x=>
x.candidate
),

weights.getWeights()

);





dashboard.render({


models:


models.map(
m=>
({

name:m.name

})

),



weights:

weights.getWeights(),



results:

top



});





document
.getElementById(
"result"
)
.innerHTML =

top.map(

(item,index)=>


`

<div class="result-item">

第${index+1}注

<br>

前区:

${

item.candidate.front.join(" ")

}

<br>

后区:

${

item.candidate.back.join(" ")

}

<br>

评分:

${

item.score.toFixed(2)

}


</div>


`

)
.join("");



log(
"Top3生成完成"
);



}



);



}





window.onload =
()=>{


document

.getElementById(
"start"
)

.onclick =
start;



};