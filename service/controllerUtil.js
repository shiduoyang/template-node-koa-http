/**
 * node controllerUtil.js controllerName
 */

const fs = require("fs");
    
function addNewController (controllerName, funcNameList = []) {
    let filePath = fs.realpathSync(`../controller/${controllerName}`);
    if (fs.existsSync(filePath)) {
        throw new Error('file already exists');
    }
    let funcNameInFile = controllerName.charAt(0).toUpperCase() + controllerName.substring(1, controllerName.length),
        contents = [
            '\n',
            `function ${funcNameInFile}() { \n`,
            `\n`,
            `}`,
        ];
    for (let funcName of funcNameList) {
        contents.push([
            '\n',
            `${funcNameInFile}.prototype.${funcName} = async (ctx, next) => {\n`,
            '\n',
            '}'
        ]);
    }
    for (let line of contents) {
        fs.appendFileSync(filePath, line);
    }
}