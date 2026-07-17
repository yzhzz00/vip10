// DLT-AI-CORE V11 FINAL
// core/cache.js
// 系统缓存模块


import fs from "fs";



class Cache {


    constructor(){


        this.path =

        "./cache";



        this.files = {


            predict:

            "./cache/predict.json",



            backtest:

            "./cache/backtest.json",



            montecarlo:

            "./cache/montecarlo.json"



        };




        this.init();



    }








    init(){


        try{


            if(
                !fs.existsSync(
                    this.path
                )
            ){


                fs.mkdirSync(
                    this.path
                );


            }



            for(
                const file of Object.values(
                    this.files
                )
            ){


                if(
                    !fs.existsSync(file)
                ){


                    fs.writeFileSync(

                        file,

                        JSON.stringify(
                            {},
                            null,
                            2
                        )

                    );


                }


            }



        }


        catch(error){


            console.log(

                "Cache init error:",

                error.message

            );


        }


    }









    save(type,data){


        try{


            if(
                !this.files[type]
            ){

                return false;

            }



            fs.writeFileSync(

                this.files[type],

                JSON.stringify(

                    data,

                    null,

                    2

                )

            );



            return true;



        }


        catch(error){


            console.log(

                "Cache save error:",

                error.message

            );


            return false;


        }



    }









    load(type){


        try{


            if(
                !this.files[type]
            ){

                return null;

            }



            if(
                !fs.existsSync(
                    this.files[type]
                )
            ){

                return null;

            }



            const data =

            fs.readFileSync(

                this.files[type],

                "utf-8"

            );



            return JSON.parse(
                data
            );



        }


        catch(error){


            return null;


        }



    }







    clear(type){


        if(
            this.files[type]
        ){


            this.save(
                type,
                {}
            );


        }


    }







}



export default Cache;