// 大乐透AI_V90
// Data Engine V90
// 大乐透历史数据读取与标准化


window.DataEngine = {


    history: [],


    initialized:false,



    init(){


        this.history=[];


        this.initialized=true;


        console.log(
            "DataEngine初始化完成"
        );


    },







    // 加载txt文本

    loadText(text){



        let lines =

        text.split(/\r?\n/);



        let data=[];




        lines.forEach(
            line=>{



                line=line.trim();



                if(!line){

                    return;

                }




                let parts =

                line.split(/\s+/);





                /*
                
                格式:

                期号
                日期
                前5
                后2

                共9个字段

                */




                if(
                    parts.length < 9
                ){

                    return;

                }






                let period =

                parts[0];



                let date =

                parts[1];






                let front =

                parts
                .slice(
                    2,
                    7
                )
                .map(
                    Number
                );





                let back =

                parts
                .slice(
                    7,
                    9
                )
                .map(
                    Number
                );








                // 数据检查


                if(
                    front.length!==5 ||
                    back.length!==2
                ){

                    return;

                }





                data.push({


                    period,


                    date,


                    front,


                    back



                });





            }
        );







        this.history=data;



        console.log(

            "大乐透数据加载:",

            data.length,

            "期"

        );




        return data;



    },









    // 获取全部历史


    getHistory(){


        return this.history;


    },









    // 获取最新一期


    getLatest(){



        if(
            this.history.length===0
        ){

            return null;

        }




        return this.history[
            this.history.length-1
        ];



    },









    // 数据统计


    count(){


        return this.history.length;


    }



};