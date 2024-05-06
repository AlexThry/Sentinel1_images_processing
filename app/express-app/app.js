const express = require('express');
const { spawn } = require('child_process');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const os = require('os');
const fs = require('fs');
const path = require('path');


const app = express();

app.use(bodyParser.json());

const newFoldersPaths = []
newFoldersPaths.push(path.join(__dirname, 'data'))
newFoldersPaths.push(path.join(__dirname, 'data/asf_set'))
newFoldersPaths.push(path.join(__dirname, 'data/interferometric_image'))
newFoldersPaths.push(path.join(__dirname, 'data/orthorectification'))
newFoldersPaths.push(path.join(__dirname, 'data/search_data_output'))

newFoldersPaths.forEach((newFolderPath) => {
    if (!fs.existsSync(newFolderPath)) {
        fs.mkdirSync(newFolderPath, { recursive: true });
        console.log(`Dossier ${newFolderPath} créé avec succès.`);
    } else {
        console.log(`Le dossier ${newFolderPath} existe déjà.`);
    }
});


if (!fs.existsSync('venv')) {

    exec('python -m venv venv', (error) => {
        if (error) {
            console.error(`Error creating virtual environment: ${error}`);
            return;
        }

        console.log('Virtual environment created successfully.');


        if (os.platform() === 'win32') {
            activateCommand = 'venv\\Scripts\\python -  m pip install -r requirements_win.txt ';
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
        let error = "";
        python.stdout.on('data', (data) => {
            const str_data = `${data}`
            if (str_data.split(",")[0] == "error") {
                error = str_data.split(",")[1]
            }
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
                res.status(200).json(error)
            }
        });

        // res.status(200).json("download");
    } catch (error) {
        console.error("erreur download", error);
        res.status(500).send("erreur download");
    }
});

app.post("/process", (req, res) => {
    const data = JSON.stringify(req.body);

    try {
        console.log("process")
        fs.writeFile('scripts/parameters_group.json', data, (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier :', err);
            } else {
                console.log('Données écrites avec succès dans output.json');
            }
        });

        let python;
        if (os.platform() === 'win32') {
            python = spawn('venv//Scripts//python', ['scripts/interferogram_by_folder.py']);
        } else{
            python = spawn('./venv/bin/python', ['scripts/interferogram_by_folder.py']);
        }

        let error = "";
        python.stdout.on('data', (data) => {
            const str_data = `${data}`
            if (str_data.split(",")[0] == "error") {
                error = str_data.split(",")[1]
            }
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
                res.status(200).json(error)
            }
        });    } catch (error) {
        console.error("erreur process", error);
        res.status(500).send("erreur process");
    }
})

app.get("/downloaded", (req, res) => {
    try {
        const downloadPath = "./data/asf_set";
        const filesAndDirs = fs.readdirSync(downloadPath, { withFileTypes: true });
        const dirs = filesAndDirs.filter(dirent => dirent.isDirectory());
        const dirNames = dirs.map(dirent => dirent.name);

        const infoJsons = dirNames.map(dirName => {
            const infoJsonPath = path.join(downloadPath, dirName, 'info.json');
            const infoJsonStr = fs.readFileSync(infoJsonPath, 'utf8');
            const infoJson = JSON.parse(infoJsonStr);
            return infoJson;
        });

        res.status(200).json(infoJsons);
    } catch (error) {
        console.error("erreur downloaded", error);
        res.status(500).send("erreur downloaded");
    }
})

app.post("/processed", (req, res) => {
    try {
        const interfPath = "./data/interferometric_image/tif";
        const filesAndDirs = fs.readdirSync(interfPath, { withFileTypes: true });
        const dirs = filesAndDirs.filter(dirent => dirent.isDirectory());
        const dirInfos = dirs.map(dir => {
            try {
                const infoJsonPath = path.join(interfPath, dir.name, 'info.json');
                const infoJsonStr = fs.readFileSync(infoJsonPath, 'utf8');
                const infoJson = JSON.parse(infoJsonStr);
                return infoJson;
            } catch {

            }
        });
        res.status(200).json(dirInfos);
    } catch (error) {
        console.error("erreur processed", error);
        res.status(500).send("erreur processed");
    }
})

app.get("/parameters", (req, res) => {
    fs.readFile("./scripts/keys_param.json", "utf8", (err, data) => {
        if (err) {
            console.error(`Error reading file from disk: ${err}`);
            res.status(500).send('Error reading file');
        } else {
            const jsonData = JSON.parse(data);
            res.status(200).json(jsonData);
        }
    })
})

app.get("/gpt-path", (req, res) => {
    fs.readFile("./scripts/gpt_path.txt", 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json("Error reading file")
        } else {
            res.status(200).json(data)
        }
    })
})

app.post("/gpt-path", (req, res) => {
    let path = req.body.path
    fs.writeFile("./scripts/gpt_path.txt", path, (err, data) => {
        if (err) {
            console.log(err)
            res.status(500).json("Error writing file")
        } else {
            res.status(200).json("ok")
        }
    })
})

app.get("/downloaded-images", (req, res) => {
    fs.readdir("./data/asf_set", (err, files) => {
        if (err) {
            console.error(`Error reading file from disk: ${err}`);
            res.status(500).send('Error reading file');
        } else {
            const zipFiles = files.filter(file => file.endsWith('.zip'));
            res.status(200).json(zipFiles);
        }
    })
})

app.post("/folder-subs", (req, res) => {
    const folderPath = "./data/" + req.body.path;

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error(`Error reading directory: ${err}`);
            res.status(500).send('Error reading directory');
        } else {
            const directories = files.filter(file => fs.statSync(path.join(folderPath, file)).isDirectory());
            res.status(200).json({ subs: directories });
        }
    });
})

app.use("/interferometric_image", express.static(path.join(__dirname, "data/interferometric_image/tif")));
app.use("/orthorectification_images", express.static(path.join(__dirname, "data/orthorectification")))

app.listen(8080);

