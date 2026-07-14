async function startAnalysis(){

    let result = document.getElementById("result");

    result.innerHTML = "正在分析数据...";

    try{

        let response = await fetch("data/dlt_raw.txt");

        let text = await response.text();


        // 提取01-35号码
        let nums = text.match(/\b\d{1,2}\b/g);


        let count = {};


        for(let i=1;i<=35;i++){
            count[i.toString().padStart(2,"0")] = 0;
        }


        nums.forEach(n=>{

            let num = n.padStart(2,"0");

            if(count[num] !== undefined){

                count[num]++;

            }

        });



        let sort = Object.entries(count)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,10);



        let html = "<h3>大乐透前区热号TOP10</h3>";

        sort.forEach((item,index)=>{

            html += 
            `${index+1}. ${item[0]}  出现 ${item[1]} 次<br>`;

        });


        result.innerHTML = html;


    }catch(e){

        result.innerHTML =
        "分析失败，请检查数据";

    }

}