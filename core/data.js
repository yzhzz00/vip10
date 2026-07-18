// core/data.js


export class DataLoader {


    constructor(){


        this.history=[];


    }



    // =========================
    // 加载数据文件
    // =========================

    async load(
        path
    ){


        let response =
            await fetch(path);



        let text =
            await response.text();



        this.history =
            this.parse(text);



        return this.history;


    }



    // =========================
    // 解析大乐透数据
    // 格式:
    // 01 05 12 23 34 + 03 08
    // =========================

    parse(text){


        let lines =
            text
            .split("\n")
            .filter(
                x=>x.trim()
            );



        let result=[];



        lines.forEach(
            line=>{


                let nums =
                    line
                    .match(
                        /\d+/g
                    );



                if(
                    !nums ||
                    nums.length<7
                ){

                    return;

                }



                nums =
                    nums.map(
                        Number
                    );



                result.push({


                    front:

                    nums
                    .slice(
                        0,
                        5
                    ),



                    back:

                    nums
                    .slice(
                        5,
                        7
                    )



                });



            }
        );



        return result;


    }



    // =========================
    // 获取最近多少期
    // =========================

    recent(
        count
    ){


        return this.history
        .slice(
            -count
        );


    }



    // =========================
    // 数据数量
    // =========================

    size(){


        return this.history.length;


    }



}