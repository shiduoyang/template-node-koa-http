const path = require('path'),
  fs = require('fs'),
  _ = require("underscore"),
  Router = require('koa-router'),
  handlebars = require('handlebars'),
  jsyaml = require('js-yaml'),
  packageConfig = require("../package.json");

let dirRealPath = path.resolve(__dirname, '../config/controller'),
  swaggerFileNames = _.filter(fs.readdirSync(dirRealPath), fileName => fileName.endsWith('.yaml')),
  swaggerRouter = new Router();

for (let swaggerFileName of swaggerFileNames) {
  let spec = fs.readFileSync(path.join(dirRealPath, swaggerFileName), 'utf8'),
    yamlData = jsyaml.safeLoad(spec),
    swaggerName = swaggerFileName.split('.')[0],
    jsonFilePath = path.join(__dirname, `${swaggerName}.json`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(yamlData), 'utf8');

  const defaultOptions = {
    title: 'Swagger UI',
    oauthOptions: false,
    swaggerOptions: {
      dom_id: '#swagger-ui',
      url: `/${swaggerName}json`,
      layout: 'StandaloneLayout',
    },
    routePrefix: `/${swaggerName}`,
    swaggerVersion: packageConfig.dependencies['swagger-ui-dist'],
    hideTopbar: false,
  };
  handlebars.registerHelper('json', context => JSON.stringify(context));
  let index = handlebars.compile(fs.readFileSync(path.join(__dirname, 'index.hbs'), 'utf8'));

  swaggerRouter.get(`/${swaggerName}json`, async (ctx, next) => {
    ctx.body = fs.readFileSync(jsonFilePath, 'utf8');
  });

  swaggerRouter.get(`/${swaggerName}`, async (ctx, next) => {
    ctx.type = 'text/html';
    ctx.body = index(defaultOptions);
  });
}

module.exports = swaggerRouter;