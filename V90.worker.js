// =====================================
// 大乐透AI V90 Worker
// 后台计算核心
// =====================================


self.onmessage = function(e){


    const msg = e.data;



    // ===============================
    // 100万次蒙特卡罗模拟
    // ===============================


    if(msg.type === "MONTE_CARLO"){



        const times =
        msg.times || 1000000;



        let result = {};



        for(let i = 0; i < times; i++){



            let front=[];



            while(front.length < 5){


                let n =
                Math.floor(
                    Math.random()*35
                )+1;



                if(!front.includes(n)){


                    front.push(n);


                }



            }



            front.sort(
                (a,b)=>a-b
            );



            let key =
            front.join("-");



            if(!result[key]){


                result[key]=0;


            }


            result[key]++;




            // 每5万次回传一次进度

            if(i % 50000 === 0){



                self.postMessage({


                    type:"PROGRESS",


                    value:
                    Math.floor(
                    i/times*100
                    ),


                    current:i,


                    total:times



                });



            }



        }





        let ranking =

        Object.keys(result)

        .sort(
            (a,b)=>
            result[b]-result[a]
        )


        .slice(0,20)

        .map(x=>({


            numbers:x,


            count:
            result[x]


        }));





        self.postMessage({


            type:"MONTE_CARLO_RESULT",


            data:ranking



        });



    }



};