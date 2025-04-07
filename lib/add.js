const cds = require('@sap/cds-dk')
const { exists, path, copy } = cds.utils, { join } = path
const users = require("./tmpl/users") 

module.exports = class extends cds.add.Plugin {

    async run() { 
        await Promise.all(['db', 'srv', 'test'].map(async each => {
            
            let src = join(__dirname, `tmpl/${each}`)
            if(exists(src)) return await copy(src).to(each)
        }))
        cds.add.merge(users).into('package.json')
        
    } 
}