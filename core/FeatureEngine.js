/*
================================

大乐透智能分析系统

V80.0 CORE

FeatureEngine.js

特征工程引擎

================================
*/


class FeatureEngine{


constructor(){


    this.features=[];


    this.version="V80.0";



}









// ============================
// 生成全部特征
// ============================


build(data){



    this.features=[];




    data.forEach(

        (item,index)=>{



            let prev=

            index>0

            ?

            data[index-1]

            :

            null;






            this.features.push(

                this.create(

                    item,

                    prev

                )

            );



        }



    );





    return this.features;



}









// ============================
// 单期特征
// ============================


create(item,prev){



    let front=item.front;


    let back=item.back;







    return {



        period:item.period,


        date:item.date,






        // 原号码

        front:front,


        back:back,







        // 前区和值

        frontSum:

        front.reduce(

            (a,b)=>a+b,

            0

        ),






        // 后区和值

        backSum:

        back.reduce(

            (a,b)=>a+b,

            0

        ),







        // 奇偶

        oddEven:

        this.oddEven(front),







        // 大小

        bigSmall:

        this.bigSmall(front),








        // 三分区

        zone:

        this.zone(front),







        // 跨度

        span:

        Math.max(...front)

        -

        Math.min(...front),







        // 连号

        consecutive:

        this.consecutive(front),







        // 与上一期重复

        repeat:

        prev

        ?

        this.repeat(

            front,

            prev.front

        )

        :

        0





    };



}









// ============================
// 奇偶
// ============================


oddEven(nums){



    let odd=0;


    let even=0;





    nums.forEach(n=>{



        if(n%2)

            odd++;

        else

            even++;



    });




    return {


        odd,

        even,


        value:

        odd+":"+even



    };


}









// ============================
// 大小
// 大乐透前区
// 1-17小
// 18-35大
// ============================


bigSmall(nums){



    let small=0;


    let big=0;





    nums.forEach(n=>{



        if(n<=17)

            small++;

        else

            big++;



    });






    return {


        small,

        big,


        value:

        small+":"+big



    };


}









// ============================
// 三分区
// ============================


zone(nums){



    let a=0;

    let b=0;

    let c=0;





    nums.forEach(n=>{



        if(n<=12)

            a++;


        else if(n<=24)

            b++;


        else

            c++;



    });





    return {


        low:a,


        mid:b,


        high:c,


        value:

        a+":"+b+":"+c



    };


}









// ============================
// 连号数量
// ============================


consecutive(nums){



    let count=0;





    for(

        let i=1;

        i<nums.length;

        i++

    ){



        if(

            nums[i]

            -

            nums[i-1]

            ===1

        ){


            count++;



        }



    }




    return count;



}









// ============================
// 重号
// ============================


repeat(a,b){



    return a.filter(

        x=>

        b.includes(x)

    )

    .length;



}









// ============================
// 状态
// ============================


status(){



    return {



        version:this.version,


        count:this.features.length



    };



}



}





window.FeatureEngine=

new FeatureEngine();