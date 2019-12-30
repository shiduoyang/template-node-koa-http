const fs = require("fs"),
    _ = require("underscore"),
    path = require("path"),
    jsyaml = require('js-yaml');

function ControllerService() {
    
}

/**
 * append interface to file ,create file if not exists
 * @param apiFilePath
 * @param controllerClassName
 * @param interfaceName
 * @param method
 * @param summary
 * @param description
 * @param parameters
 */
ControllerService.prototype.appendInterfaceToFile = function (apiFilePath, controllerClassName, interfaceName, method, summary, description, parameters = []) {
    if (!fs.existsSync(apiFilePath)) {
        let content =
            '\n'
            + `function ${controllerClassName}() {\n`
            + '\n'
            + `}\n`
            + '\n'
            + '//############interface area###############\n'
            + '//############interface area###############\n'
            + '\n'
            + `module.exports = new ${controllerClassName}();\n`;
        fs.writeFileSync(apiFilePath, content);
    }
    let contentBefore = fs.readFileSync(apiFilePath).toString('utf8'),
        contentSplit = contentBefore.split('//############interface area###############\n');
    if ((contentSplit[1] || '').includes(`${controllerClassName}.prototype.${interfaceName}`)) {
        return;
    }
    let interfaceContentI = ''
        + `/**\n`
        + ` * @method ${method}\n`
        + ` * @summary ${summary}\n`
        + ` * @description ${description}\n`;
    for (let param of parameters) {
        interfaceContentI += ` * @requestParam ${param.name || ''} ${param.description || ''}\n`;
    }
    interfaceContentI = interfaceContentI
        + ' *  */\n'
        + `${controllerClassName}.prototype.${interfaceName} = async (ctx, next) => {\n`
        + '\n'
        + `}\n`
        + `\n`;
    let contentNew = contentSplit[0]
        + '//############interface area###############\n'
        + contentSplit[1]
        + interfaceContentI
        + '//############interface area###############\n'
        + contentSplit[2];
    fs.writeFileSync(apiFilePath, contentNew, { encoding: 'utf8' });
}

ControllerService.prototype.checkForBuildNewController = function (configDirPath, controllerDirPath) {
    if (!fs.existsSync(configDirPath)) {
        throw new Error('config dir path error');
    }
    if (!fs.existsSync(controllerDirPath)) {
        fs.mkdirSync(controllerDirPath);
    }
    let swaggerFileNames = _.filter(fs.readdirSync(configDirPath), fileName => fileName.endsWith('.yaml'));
    for (let swaggerFileName of swaggerFileNames) {
        let spec = fs.readFileSync(path.join(configDirPath, swaggerFileName), 'utf8'),
            yamlData = jsyaml.safeLoad(spec),
            pathsObj = yamlData ? (yamlData.paths || {}) : {};
        
        for (let apiName in pathsObj) {
            let v1 = pathsObj[apiName],
                method = Object.keys(v1)[0],
                v2 = v1[method],
                description = v2.description || '',
                parameters = v2.parameters || [],
                responses = v2.responses || {},
                summary = v2.summary || '',
                apiNameSplit = apiName.split('/'),
                interfaceName = apiNameSplit[apiNameSplit.length - 1],
                controllerFileDirPath = path.join(
                    controllerDirPath,
                    ...(apiNameSplit.length >= 3 ? _.reject(apiNameSplit.slice(0, apiNameSplit.length - 2), item => item == '') : [])
                ),
                controllerFileName = (apiNameSplit.length >= 2 ? apiNameSplit[apiNameSplit.length - 2] : 'common'),
                controllerFilePath = path.join(controllerFileDirPath, controllerFileName + '.js');
            
            if (!fs.existsSync(controllerFileDirPath)) {
                fs.mkdirSync(controllerFileDirPath);
            }
            this.appendInterfaceToFile(
                controllerFilePath,
                controllerFileName.charAt(0).toUpperCase() + '' + controllerFileName.slice(1, controllerFileName.length),
                interfaceName,
                method,
                summary,
                description,
                parameters
            );
        }
    }
   
}

module.exports = new ControllerService();