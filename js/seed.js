window.V110_SEED = {



    value:123456,




    // 设置种子

    set(seed){


        this.value=seed;


    },






    // 生成随机数

    random(){



        this.value =

        (

            this.value * 9301

            +

            49297

        )

        %

        233280;





        return this.value / 233280;



    },







    // 稳定随机

    stableRandom(key){



        let hash=0;



        for(
            let i=0;
            i<key.length;
            i++
        ){


            hash +=

            key.charCodeAt(i);



        }





        this.set(hash);




        return this.random();



    }






};