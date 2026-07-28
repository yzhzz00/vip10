const express = require("express");
const cors = require("cors");
const path = require("path");

const config = require("./config");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


/**
 * 系统状态
 */
app.get("/api/status", (req, res) => {

    res.json({
        name: config.name,
        version: config.version,
        status: "running",
        mode: "rolling-backtest"
    });

});


/**
 * 预测接口
 */
app.get("/api/predict", (req, res) => {

    const predict = require("./core/predict");

    const result = predict.run();

    res.json(result);

});


/**
 * 历史滚动回测接口
 */
app.get("/api/backtest", (req, res) => {

    const backtest = require("./core/backtest");

    const result = backtest.run();

    res.json(result);

});


/**
 * 学习更新接口
 */
app.post("/api/learn", (req, res) => {

    const learn = require("./core/learn");

    const result = learn.update(req.body);

    res.json(result);

});


const PORT = config.port;


app.listen(PORT, () => {

    console.log(
        `${config.name} running on port ${PORT}`
    );

});
