const cds = require('@sap/cds-dk')
const { exists, path, copy } = cds.utils, { join } = path
const { merge } = cds.add
const packageJson = require("@capire/incidents/package.json")
const packagePath = path.dirname(require.resolve("@capire/incidents/package.json")); 
const users = { cds: packageJson.cds }


module.exports = class extends cds.add.Plugin {

    options() { 
        return { 
            'with-plugin': { 
                type: 'string', 
                short: 'pg', 
                help: 'The demo plugins to add. Example: --with-plugin change-tracking', 
            } 
        } 
    }

    async run() { 
        await Promise.all(['db', 'srv/services.cds', 'test/basics.test.js'].map(async each => {
            
            let src = join(packagePath ,`${each}`)
            if(exists(src)) return await copy(src).to(each)
        }))
        merge(users).into('package.json')

        const plugin = cds.cli.options["with-plugin"] || cds.cli.options?.plan
        if(plugin != null && plugin != ""){
            switch(plugin){
                
                case "change-tracking":
                    await copy(join(packagePath, 'xmpls/change-tracking.cds')).to('srv/change-tracking.cds')
                    merge({"dependencies": {"@cap-js/change-tracking": ">=1"}}).into('package.json')
                    break;
                case "attachments":
                    await copy(join(packagePath, 'xmpls/attachments.cds')).to('srv/attachments.cds')
                    merge({"dependencies": {"@cap-js/attachments": ">=2"}}).into('package.json')
                    break;
                case "audit-logging":
                    await copy(join(packagePath, 'xmpls/data-privacy.cds')).to('srv/data-privacy.cds')
                    merge({"dependencies": {"@cap-js/audit-logging": ">=0"}}).into('package.json')
                    break;
                case "enhance-ui": {
                    // check if the folder "app/incidents" exists
                    const appFolder = join(process.cwd(), 'app/incidents')
                    if (!exists(appFolder)) {
                        throw new Error('⚠️ Generate the incidents project from fiori template first')
                    }
                    await copy(join(packagePath, 'app/incidents/annotations.cds')).to('app/incidents/annotations.cds')
                    break;
                }
                default:
                    console.log("Unsupported Plugin: " + plugin)
                    break;
            }
        }
        
    } 
}