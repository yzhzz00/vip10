/*
================================

大乐透智能分析系统

V80.0 CORE

DataEngine.js

数据核心引擎

================================
*/


class DataEngine {


constructor(){


    this.data=[];


    this.version="V80.0";



}









// ============================
// 加载数据
// ============================


async load(url="data/dlt.txt"){


    try{


        let response=

        await fetch(url);




        let text=

        await response.text();





        this.parse(text);





        return this.data;



    }


    catch(e){



        console.error(

            "DataEngine加载失败",

            e

        );



        return [];



    }



}









// ============================
// 数据解析
// 格式:
//
// 07001
// 日期
// 前区5个
// 后区2个
//
// ============================


parse(text){



    this.data=[];




    let lines=

    text.split("\n");





    lines.forEach(line=>{



        line=line.trim();




        if(!line)return;






        let arr=

        line.split(/\s+/);







        if(arr.length>=9){





            let item={



                period:arr[0],



                date:arr[1],





                front:

                arr.slice(

                    2,

                    7

                )

                .map(Number),





                back:

                arr.slice(

                    7,

                    9

                )

                .map(Number)



            };







            this.data.push(item);



        }



    });







    return this.data;



}









// ============================
// 获取全部数据
// ============================


getAll(){



    return this.data;



}









// ============================
// 获取最近多少期
// ============================


recent(count=100){



    return this.data.slice(

        -count

    );



}









// ============================
// 数据状态
// ============================


status(){



    return {



        version:this.version,



        count:this.data.length,



        ready:

        this.data.length>0



    };



}



}








window.DataEngine=

new DataEngine();