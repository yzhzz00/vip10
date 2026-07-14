async function startAnalysis(){

    let result = document.getElementById("result");

    result.innerHTML = "正在分析数据...";


    try{

        let response = await fetch("data/dlt_raw.txt?v=3000");

        let text = await response.text();


        let lines = text.split("\n");

        let data = [];


        // 数据清洗
        lines.forEach(line=>{

            let nums = line.match(/\b\d{2}\b/g);


            if(nums && nums.length >= 7){

                let arr = nums.slice(-7);


                let front = arr.slice(0,5);

                let back = arr.slice(5,7);


                data.push({

                    front:front,

                    back:back

                });

            }

        });



        // 前区频率

        let count={};


        for(let i=1;i<=35;i++){

            let n=i.toString().padStart(2,"0");

            count[n]=0;

        }



        data.forEach(item=>{

            item.front.forEach(n=>{

                if(count[n]!==undefined){

                    count[n]++;

                }

            });

        });



        // 热号

        let hot = Object.entries(count)

        .sort((a,b)=>b[1]-a[1])

        .slice(0,10);



        // 冷号

        let cold = Object.entries(count)

        .sort((a,b)=>a[1]-b[1])

        .slice(0,10);



        // 当前遗漏

        let miss={};


        for(let i=1;i<=35;i++){

            let n=i.toString().padStart(2,"0");

            miss[n]=0;


            for(let j=0;j<data.length;j++){

                if(data[j].front.includes(n)){

                    break;

                }

                miss[n]++;

            }

        }



        // 和值

        let totalSum=0;


        data.forEach(item=>{

            item.front.forEach(n=>{

                totalSum+=parseInt(n);

            });

        });



        let avgSum=(totalSum/data.length).toFixed(2);



        // 奇偶

        let odd=0;

        let even=0;


        data.forEach(item=>{

            item.front.forEach(n=>{

                if(parseInt(n)%2==0){

                    even++;

                }else{

                    odd++;

                }

            });

        });



        // 三区

        let zone1=0;

        let zone2=0;

        let zone3=0;


        data.forEach(item=>{


            item.front.forEach(n=>{

                let x=parseInt(n);


                if(x<=12){

                    zone1++;

                }

                else if(x<=24){

                    zone2++;

                }

                else{

                    zone3++;

                }

            });

        });



        let html="";


        html+="<h3>数据检测</h3>";

        html+="有效开奖："+data.length+"期<br>";



        html+="<h3>大乐透前区热号TOP10</h3>";

        hot.forEach((x,i)=>{

            html+=`${i+1}. ${x[0]} 出现 ${x[1]} 次<br>`;

        });



        html+="<h3>大乐透前区冷号TOP10</h3>";

        cold.forEach((x,i)=>{

            html+=`${i+1}. ${x[0]} 出现 ${x[1]} 次<br>`;

        });



        html+="<h3>当前遗漏TOP10</h3>";

        Object.entries(miss)

        .sort((a,b)=>b[1]-a[1])

        .slice(0,10)

        .forEach((x,i)=>{

            html+=`${i+1}. ${x[0]} 遗漏 ${x[1]} 期<br>`;

        });



        html+="<h3>和值分析</h3>";

        html+="平均和值："+avgSum+"<br>";



        html+="<h3>奇偶分析</h3>";

        html+="奇数数量："+odd+"<br>";

        html+="偶数数量："+even+"<br>";



        html+="<h3>三区分布</h3>";

        html+="一区01-12："+zone1+"<br>";

        html+="二区13-24："+zone2+"<br>";

        html+="三区25-35："+zone3+"<br>";



        result.innerHTML=html;


    }


    catch(e){

        result.innerHTML="分析失败："+e.message;

    }


}