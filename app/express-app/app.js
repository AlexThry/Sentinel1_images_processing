const express = require('express');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs');


const app = express();

app.use(bodyParser.json());

if (!fs.existsSync('venv')) {

    exec('python -m venv venv', (error) => {
        if (error) {
            console.error(`Error creating virtual environment: ${error}`);
            return;
        }

        console.log('Virtual environment created successfully.');


        if (os.platform() === 'win32') {
            activateCommand = 'venv\\Scripts\\python -m pip install -r requirements_win.txt ';
        } else {
            activateCommand = 'source venv/bin/activate && pip install -r requirements.txt';
        }

        exec(activateCommand, (error) => {
            if (error) {
                console.error(`Error installing dependencies: ${error}`);
                return;
            }

            console.log('Dependencies installed successfully.');
        });
    })
} else {
    console.log("venv and dependencies already installed")
}


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.post("/search", (req, res) => {
    //--date_start --date_end --polygon
    //renvoie json
    console.log("searching")
    let python;
    if (os.platform() === 'win32') {
        python = spawn('venv//Scripts//python', ['scripts/search.py', '--poligon', req.body.polygon, "--date_start", req.body.startDate, "--date_end", req.body.endDate]);
    } else {
        python = spawn('./venv/bin/python', ['scripts/search.py', '--poligon', req.body.polygon, "--date_start", req.body.startDate, "--date_end", req.body.endDate]);
    }
    python.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
    });

    python.stderr.on('data', (data) => {
        console.log("stderr: " + data);
    });

    python.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        fs.readFile('data/search_data_output/output.json', 'utf8', (err, data) => {
            if (err) {
                console.error(`Error reading file from disk: ${err}`);
            } else {
                const jsonData = JSON.parse(data);

                console.log(jsonData);

                res.status(200).json(jsonData);
            }
        });

    });

})

app.post("/download", (req, res) => {
    //--jsonfile --login --password
    try {
        console.log("downloading")
        let python;
        if (os.platform() === 'win32') {
            python = spawn('venv//Scripts//python', ['scripts/download.py', "--login", req.body.login, "--password", req.body.password, "--selected", `${req.body.selected}`]);
        }else{
            python = spawn('./venv/bin/python', ['scripts/download.py', "--login", req.body.login, "--password", req.body.password, "--selected", `${req.body.selected}`]);
        }
        python.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        python.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });

        python.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code == 0) {
                res.status(200).json("success")
            } else {
                res.status(200).json("an error occured")
            }
        });

        // res.status(200).json("download");
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

