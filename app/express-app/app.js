const express = require('express');

const app = express();

app.use((req, res, next) => {
    // Attach CORS headers
    // Required when using a detached backend (that runs on a different domain)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.post("/download", (req, res) => {
    try {
        res.status(200).json("download");
    } catch (error) {
        console.error("erreur download", error);
        res.status(500).send("erreur download");
    }
});

app.post("/process", (req, res) => {
    try {
        res.status(200).json("process");
    } catch (error) {
        console.error("erreur process", error);
        res.status(500).send("erreur process");
    }
})

app.post("/downloaded", (req, res) => {
    try {
        res.status(200).json("downloaded");
    } catch (error) {
        console.error("erreur downloaded", error);
        res.status(500).send("erreur downloaded");
    }
})

app.post("/processed", (req, res) => {
    try {
        res.status(200).json("processed");
    } catch (error) {
        console.error("erreur processed", error);
        res.status(500).send("erreur processed");
    }
})

app.listen(8080);

