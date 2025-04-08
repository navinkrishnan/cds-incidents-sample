const cds = require('@sap/cds-dk')
const { exists, path, copy } = cds.utils, { join } = path
const users = require("./tmpl/users") 

module.exports = class extends cds.add.Plugin {

    async run() { 
        await Promise.all(['db', 'srv/services.cds', 'test/basics.test.js'].map(async each => {
            
            let src = join(__dirname, "../" ,`node_modules/@capire/incidents/${each}`)
            if(exists(src)) return await copy(src).to(each)
        }))
        cds.add.merge(users).into('package.json')
        
    } 
}