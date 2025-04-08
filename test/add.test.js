const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

describe('Testing CDS initialization', () => {
    let tempFolder;

    beforeAll(() => {
        // Create `.tmp` folder in your project if it doesn't exist
        const baseTmp = path.join(__dirname, '.tmp');
        if (!fs.existsSync(baseTmp)) {
            fs.mkdirSync(baseTmp);
        }

        // Create a unique subfolder inside .tmp
        const uniqueName = `test-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        tempFolder = path.join(baseTmp, uniqueName);
        fs.mkdirSync(tempFolder);
    });

    test('Initialize "my-incidents" and run cds add incidents-sample', () => {

        // Run the command to initialize "my-incidents"
        execSync(`cds init my-incidents`, { cwd: tempFolder });
        const projectFolder = path.join(tempFolder, 'my-incidents');
        updateDependency(projectFolder);
        execSync(`npm install`, { cwd: projectFolder })
        execSync('cds add incidents-sample', { cwd: projectFolder });

        // Check if the folder "my-incidents" was created
        const newFolder = path.join(tempFolder, 'my-incidents');
        const folderExists = fs.existsSync(newFolder) && fs.lstatSync(newFolder).isDirectory();

        // check if the file "schema.cds" exists inside the "my-incidents/db" folder
        const dbFolder = path.join(projectFolder, 'db');
        const schemaFile = path.join(dbFolder, 'schema.cds');
        fs.existsSync(schemaFile) && fs.lstatSync(schemaFile).isFile();

        // check if the file "services.cds" exists inside the "my-incidents/srv" folder
        const srvFolder = path.join(projectFolder, 'srv');
        const servicesFile = path.join(srvFolder, 'services.cds');
        fs.existsSync(servicesFile) && fs.lstatSync(servicesFile).isFile();
        // check if the file "basics.test.js" exists inside the "my-incidents/test" folder
        const testFolder = path.join(projectFolder, 'test');
        const testFile = path.join(testFolder, 'basics.test.js');
        fs.existsSync(testFile) && fs.lstatSync(testFile).isFile();
        
        expect(folderExists).toBe(true);
    });

    afterAll(() => {
        // Recursively delete the temp folder
       fs.rmSync(tempFolder, { recursive: true, force: true });
    });

    function updateDependency(projectFolder) {
        // write dependency in package.json
        const packageJSONPath = path.join(projectFolder, 'package.json')
        const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, 'utf8'))
        packageJSON.devDependencies["@navinkrishnan/incidents-sample"] = "file:../../../../"
        fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON, null, 4))
    }
});
