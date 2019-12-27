const Koa = require("koa"),
    KoaStatic = require('koa-static'),
    koaBody = require('koa-body'),
    ipFilter = require("koa-ip-filter"),
    cors = require('koa2-cors'),
    logger = require("./service/logUtil"),
    swagger = require('./swagger'),
    serverConfig = require("./config/serverConfig.json");

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

app.use(swagger.routes());



app.on('error', (err, ctx) => {
    logger.logError(ctx, err);
    console.error('server error', err, ctx);
});

app.listen(serverConfig.serverPort);

console.log('server listen port: ' + serverConfig.serverPort);