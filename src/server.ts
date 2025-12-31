import express from "express";

const app = express();


app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

app.get("/", (_req, res) => {
    res.redirect(`https://wothsmflx.org`);
})

export default app;