// app.js


import {DataLoader}
from "./core/data.js";


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




// =========================
// 启动系统
// =========================


async function start(){



const loader =
new DataLoader();



const history =
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




// =========================
// 模型初始化
// =========================


const models=[


new FrequencyModel(),

new BayesModel(),

new MarkovModel(),

new MonteModel(),

new AntiHumanModel(),

new TrendAIModel()


];




// =========================
// 训练
// =========================


models.forEach(
model=>{


if(model.train){

model.train(
history
);

}


});





const weights =
new WeightManager();



models.forEach(
model=>{


weights.register(
model.name
);


});





const learning =
new LearningEngine(
models,
weights
);




// =========================
// AI委员会
// =========================


const committee =
new AICommittee(
models
);





// =========================
// 蒙特卡罗核心
// =========================


const monte =
new MonteCarloEngine();



const monitor =
new LearningMonitor(
"monitor"
);



monte.run(

models,

{history},

(progress)=>{


monitor.updateProgress(
progress.toFixed(2)
);


monitor.addLog(

"蒙特卡罗模拟进度 "
+
progress.toFixed(2)
+
"%"

);


}

);




// =========================
// 最终Top3
// =========================


const pool =
monte.rank();



const results =
committee.predict(

pool.map(
x=>x.candidate
),

weights.getWeights()

);




// =========================
// 展示
// =========================


const dashboard =
new Dashboard(
"dashboard"
);



dashboard.render({

models:

models.map(
m=>({

name:m.name,

score:1

})

),


weights:

weights.getWeights(),


results


});



monitor.addLog(
"AI委员会完成竞争"
);



monitor.addLog(
"最终预测生成完成"
);



monitor.render({

models:

models.map(
m=>({

name:m.name,

score:1

})

)

});



}




window.onload =
start;