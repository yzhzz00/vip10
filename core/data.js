// core/data.js


export class DataLoader {


    constructor(){


        this.history=[];


    }





    // =====================
    // 加载数据
    // =====================

    async load(
        path
    ){


        const res =
        await fetch(path);



        const text =
        await res.text();



        this.history =
        this.parse(text);



        return this.history;


    }





    // =====================
    // 数据解析
    // 支持:

    // 01 05 12 23 33 + 03 08
    // 或
    // 0105122333+0308

    // =====================

    parse(
        text
    ){


        let lines =

        text
        .split(/\r?\n/)
        .map(
            x=>x.trim()
        )
        .filter(
            x=>x
        );



        let result=[];




        lines.forEach(
        line=>{


            let nums =

            line.match(
                /\d+/g
            );



            if(
                !nums
                ||
                nums.length<7
            ){

                return;

            }



            nums =

            nums.map(
                Number
            );



            let front =

            nums.slice(
                0,
                5
            );



            let back =

            nums.slice(
                5,
                7
            );





            // 数据合法检查

            if(

                front.length===5
                &&
                back.length===2
                &&
                front.every(
                    n=>
                    n>=1
                    &&
                    n<=35
                )
                &&
                back.every(
                    n=>
                    n>=1
                    &&
                    n<=12
                )

            ){


                result.push({


                    front:


                    front.sort(
                        (a,b)=>
                        a-b
                    ),



                    back:


                    back.sort(
                        (a,b)=>
                        a-b
                    )



                });



            }



        });



        return result;



    }





    // =====================
    // 最近多少期
    // =====================

    recent(
        count
    ){


        return this.history.slice(
            -count
        );


    }





    // =====================
    // 总期数
    // =====================

    size(){


        return this.history.length;


    }





}