const cds = require('@sap/cds-dk')
const { exists, path, copy } = cds.utils, { join } = path
const packageJson = require("@capire/incidents/package.json")
const packagePath = path.dirname(require.resolve("@capire/incidents/package.json")); 
const users = { cds: packageJson.cds }

module.exports = class extends cds.add.Plugin {

    options() { 
        return { 
            'plugin': { 
                type: 'string', 
                short: 'pg', 
                help: 'The demo plugins to add. Example: --plugin change-tracking', 
            } 
        } 
    }

    async run() { 
        await Promise.all(['db', 'srv/services.cds', 'test/basics.test.js'].map(async each => {
            
            let src = join(packagePath ,`${each}`)
            if(exists(src)) return await copy(src).to(each)
        }))
        cds.add.merge(users).into('package.json')

        const plugin = cds.cli.options.plugin
        if(plugin != null && plugin != ""){
            switch(plugin){
                
                case "change-tracking":
                    await copy(join(packagePath, 'xmpls/change-tracking.cds')).to('srv/change-tracking.cds')
                    cds.add.merge({"dependencies": {"@cap-js/change-tracking": ">=1"}}).into('package.json')
                    break;
                case "attachments":
                    await copy(join(packagePath, 'xmpls/attachments.cds')).to('srv/attachments.cds')
                    cds.add.merge({"dependencies": {"@cap-js/attachments": ">=2"}}).into('package.json')
                    break;
                case "audit-logging":
                    await copy(join(packagePath, 'xmpls/data-privacy.cds')).to('srv/data-privacy.cds')
                    cds.add.merge({"dependencies": {"@cap-js/audit-logging": ">=0"}}).into('package.json')
                    break;
                case "enhance-ui":
                    await copy(join(packagePath, 'app/incidents/annotations.cds')).to('app/incidents/annotations.cds')
                    break;
                default:
                    break;
            }
        }
        
    } 
}