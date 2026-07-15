window.V110_PARSER = {


    parse(text){


        let history = [];


        let lines =
        text.split("\n");



        lines.forEach(line=>{


            line=line.trim();



            if(!line){

                return;

            }



            let arr =
            line.split(/\s+/);



            // 格式：

            // 期号 日期
            // 前区5 后区2

            if(arr.length < 9){

                return;

            }




            history.push({


                period: arr[0],


                date: arr[1],



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


            });



        });



        return history;



    }



};