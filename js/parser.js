window.DLT_PARSER = {



    // 解析单行数据

    parseLine(line){



        if(!line || line.trim()===""){

            return null;

        }



        let arr = line.trim().split(/\s+/);



        if(arr.length < 8){

            return null;

        }



        return {



            period:arr[0],



            date:arr[1],



            front:[

                Number(arr[2]),

                Number(arr[3]),

                Number(arr[4]),

                Number(arr[5]),

                Number(arr[6])

            ],



            back:[

                Number(arr[7]),

                Number(arr[8])

            ]



        };



    },









    // 解析全部文本

    parse(text){



        let lines = text.split("\n");



        let result=[];



        for(let line of lines){



            let item=this.parseLine(line);



            if(item){


                result.push(item);


            }



        }



        return result;



    },









    // 验证数据

    check(data){



        let error=[];



        data.forEach(item=>{



            if(item.front.length!==5){


                error.push(

                    item.period+" 前区错误"

                );


            }




            if(item.back.length!==2){


                error.push(

                    item.period+" 后区错误"

                );


            }




        });




        return {


            total:data.length,


            error:error



        };



    },









    // 获取最近多少期

    recent(data,count){



        return data.slice(


            Math.max(

                data.length-count,

                0

            )



        );



    },









    // 获取前区号码统计

    frontNumbers(data){



        let result={};



        for(let i=1;i<=35;i++){



            result[i]=0;



        }




        data.forEach(item=>{



            item.front.forEach(n=>{



                result[n]++;



            });



        });




        return result;



    },









    // 获取后区号码统计

    backNumbers(data){



        let result={};



        for(let i=1;i<=12;i++){



            result[i]=0;



        }




        data.forEach(item=>{



            item.back.forEach(n=>{



                result[n]++;



            });



        });




        return result;



    }







};