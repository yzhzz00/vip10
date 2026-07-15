// ==================================================
// 大乐透 AI V100 CORE FINAL
// model_version.js
// AI模型版本管理
// ==================================================

"use strict";


window.V100ModelVersion = {


    currentVersion:"V100.0",


    versions:[],






    // ==========================
    // 初始化
    // ==========================


    init(){


        let data =

        localStorage.getItem(
            "V100_MODEL_VERSION"
        );



        if(data){


            let obj =
            JSON.parse(data);


            this.currentVersion =
            obj.currentVersion;


            this.versions =
            obj.versions;


        }



    },







    // ==========================
    // 创建新版本
    // ==========================


    create(
        name,
        description
    ){



        let model =

        localStorage.getItem(
            "V100_AI_MODEL"
        );




        let version={



            id:name,



            description,



            time:

            new Date()
            .toLocaleString(),



            model:

            model

            ?

            JSON.parse(model)

            :

            null



        };






        this.versions.push(
            version
        );





        this.currentVersion =
        name;






        this.save();




        return version;



    },








    // ==========================
    // 保存
    // ==========================


    save(){



        localStorage.setItem(


            "V100_MODEL_VERSION",


            JSON.stringify({


                currentVersion:

                this.currentVersion,


                versions:

                this.versions



            })


        );


    },









    // ==========================
    // 回退版本
    // ==========================


    rollback(versionId){



        let target =

        this.versions.find(

            v=>

            v.id===versionId

        );




        if(
            !target
        ){

            return false;

        }






        if(
            target.model
        ){


            localStorage.setItem(

                "V100_AI_MODEL",

                JSON.stringify(
                    target.model
                )

            );


        }





        this.currentVersion =
        versionId;



        this.save();



        return true;



    },









    // ==========================
    // 获取版本列表
    // ==========================


    list(){


        return {


            current:

            this.currentVersion,


            versions:

            this.versions


        };


    }






};







document.addEventListener(

"DOMContentLoaded",

()=>{


    V100ModelVersion.init();


});