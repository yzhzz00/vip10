/**
 * DLT-AI-CORE VIP
 * Data Engine V5.0 FINAL
 *
 * 大乐透数据管理核心
 */


import fs from "fs";



class DataEngine {



    constructor(){



        this.file =

        "./data/dlt_raw.txt";



        this.jsonFile =

        "./data/history.json";



    }









    async load(){



        if(

            fs.existsSync(

                this.jsonFile

            )

        ){



            return this.readJSON();



        }







        const history =

        this.parseTXT();





        this.saveJSON(

            history

        );





        return history;



    }









    parseTXT(){



        if(

            !fs.existsSync(

                this.file

            )

        ){



            return [];

        }








        const text =

        fs.readFileSync(

            this.file,

            "utf-8"

        );






        const lines =

        text.split(

            "\n"

        );






        const result=[];







        lines.forEach(

            line=>{



                const arr =

                line.trim()

                .split(

                    /\s+/

                );





                if(

                    arr.length>=9

                ){



                    result.push({



                        issue:

                        arr[0],




                        date:

                        arr[1],




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



                }



            }

        );







        return result;



    }









    addNew(

        item

    ){



        const history=

        this.readJSON();





        history.push(

            item

        );





        this.saveJSON(

            history

        );





        return {



            status:

            "added",



            total:

            history.length



        };



    }









    latest(){



        const history=

        this.readJSON();





        return history[

            history.length-1

        ];



    }









    readJSON(){



        try{



            return JSON.parse(

                fs.readFileSync(

                    this.jsonFile,

                    "utf-8"

                )

            );



        }catch(e){



            return [];

        }



    }









    saveJSON(

        data

    ){



        fs.writeFileSync(

            this.jsonFile,

            JSON.stringify(

                data,

                null,

                2

            )

        );



    }









    count(){



        return this.readJSON()

        .length;



    }





}



export default DataEngine;