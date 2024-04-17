const express = require('express');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const os = require('os');



const app = express();

app.use(bodyParser.json());


exec('python -m venv venv', (error) => {
    if (error) {
        console.error(`Error creating virtual environment: ${error}`);
        return;
    }

    console.log('Virtual environment created successfully.');

    
    if (os.platform() === 'win32') {
        activateCommand = 'venv\\Scripts\\python -m pip install -r requirements_win.txt ';
    }else{let activateCommand = 'source venv/bin/activate && pip install -r requirements.txt';}

    exec(activateCommand, (error) => {
        if (error) {
            console.error(`Error installing dependencies: ${error}`);
            return;
        }

        console.log('Dependencies installed successfully.');
    });
})


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log("Back end is running")
    next();
});

app.post("/download", (req, res) => {
    try {
        console.log("downloading")
        let python;
        if (os.platform() === 'win32') {
            python = spawn('venv//Scripts//python', ['scripts/asf_api.py', '--poligon', req.body.polygon, "--date_start", req.body.startDate, "--date_end", req.body.endDate, "--n_max", req.body.maxDownload, "--login", req.body.login, "--password", req.body.password]);
        }else{
            python = spawn('./venv/bin/python', ['scripts/asf_api.py', '--poligon', req.body.polygon, "--date_start", req.body.startDate, "--date_end", req.body.endDate, "--n_max", req.body.maxDownload, "--login", req.body.login, "--password", req.body.password]);
        }
        python.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        python.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        python.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });

        res.status(200).json("download");
    } catch (error) {
        console.error("erreur download", error);
        res.status(500).send("erreur download");
    }
});

app.post("/process", (req, res) => {
    try {
        console.log("process")
        res.status(200).json("process");
    } catch (error) {
        console.error("erreur process", error);
        res.status(500).send("erreur process");
    }
})

app.post("/downloaded", (req, res) => {
    try {
        console.log("downloaded")
        res.status(200).json("downloaded");
    } catch (error) {
        console.error("erreur downloaded", error);
        res.status(500).send("erreur downloaded");
    }
})

app.post("/processed", (req, res) => {
    try {
        console.log("processed")
        res.status(200).json("processed");
    } catch (error) {
        console.error("erreur processed", error);
        res.status(500).send("erreur processed");
    }
})

app.listen(8080);

