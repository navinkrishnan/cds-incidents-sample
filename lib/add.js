const cds = require('@sap/cds-dk')
const { exists, path, copy } = cds.utils, { join } = path
const packageJson = require("@capire/incidents/package.json")
const packagePath = path.dirname(require.resolve("@capire/incidents/package.json")); 
const users = { cds: packageJson.cds }

module.exports = class extends cds.add.Plugin {

    async run() { 
        await Promise.all(['db', 'srv/services.cds', 'test/basics.test.js'].map(async each => {
            
            let src = join(packagePath ,`${each}`)
            if(exists(src)) return await copy(src).to(each)
        }))
        cds.add.merge(users).into('package.json')
        
    } 
}