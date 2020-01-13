const Koa = require("koa"),
    KoaStatic = require('koa-static'),
    koaBody = require('koa-body'),
    ipFilter = require("koa-ip-filter"),
    cors = require('koa2-cors'),
    path = require("path"),
    logger = require("./service/logUtil"),
    serverConfig = require("./config/serverConfig.json");

const isTest = process.env.NODE_ENV === 'development',
    SwaggerExtra = require('swagger-extra'),
    swaggerExtra = new SwaggerExtra(
        path.join(__dirname, 'config', 'controller'),
        path.join(__dirname, 'controller'),
        {
            //是否生成swagger相关路由，默认为是
            isAutoFixControllersOpen: isTest,
            //是否将接口自动写入接口文件xx.js，默认为是
            isSwaggerOpen: isTest,
            //获取post参数对象的代码，默认为：ctx.request.body
            postBodyGetCode: 'ctx.request.body',
            //获取get参数对象的代码，默认为：ctx.param
            getParamsGetCode: 'ctx.params',
            //返回数据格式，示例：ctx.body = {code: 200, 'message': 'success', data: {}}
            controllerReturnCode: 'ctx.body = {code: 200,};'
        },
    );

const app = new Koa();

app.use(ipFilter({
    forbidden: '403: Get out of here!',
    filter: ['*', '!213.15.*'],
    strict: false,
}));

app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    logger.logRes(ctx, ms);
});

app.use(koaBody({ multipart: true }));
app.use(KoaStatic(__dirname + '/public'));

app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*";
        }
        return "*";
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

app.use(swaggerExtra.getRoutes());

app.on('error', (err, ctx) => {
    logger.logError(ctx, err);
    console.error('server error', err, ctx);
});

app.listen(serverConfig.serverPort);

console.log('server listen port: ' + serverConfig.serverPort);