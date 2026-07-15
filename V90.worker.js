// =====================================
// 大乐透AI V90 Worker
// 后台计算引擎
// =====================================



self.onmessage=function(e){



    let data=e.data;



    if(
        data.type==="MONTECARLO"
    ){



        let times =
        data.times || 10000;



        let result={};



        for(
            let i=0;
            i<times;
            i++
        ){



            let nums=[];



            while(
                nums.length<5
            ){



                let n =
                Math.floor(
                    Math.random()*35
                )+1;



                if(
                    !nums.includes(n)
                ){

                    nums.push(n);

                }



            }



            nums.sort(
                (a,b)=>a-b
            );



            let key =
            nums.join(",");



            if(
                !result[key]
            ){

                result[key]=0;

            }



            result[key]++;



        }






        let ranking =
        Object.keys(result)

        .sort(
            (a,b)=>
            result[b]-result[a]
        )

        .slice(0,20)

        .map(
            x=>({

                numbers:x,

                count:result[x]

            })
        );





        self.postMessage({

            type:
            "MONTECARLO_RESULT",


            data:
            ranking


        });



    }



};