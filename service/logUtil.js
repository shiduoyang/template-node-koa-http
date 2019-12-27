const log4js = require("log4js");
const timeService = require("./time");

function LogUtil() {
    let config = {
        replaceConsole: true,
        appenders: {
            stdout: {//控制台输出
                type: 'stdout'
            },
            req: {//请求日志
                type: 'dateFile',
                filename: 'logs/reqlog/',
                pattern: 'req-yyyy-MM-dd.log',
                alwaysIncludePattern: true
            },
            err: {//错误日志
                type: 'dateFile',
                filename: 'logs/errlog/',
                pattern: 'err-yyyy-MM-dd.log',
                alwaysIncludePattern: true
            },
            oth: {//其他日志
                type: 'dateFile',
                filename: 'logs/othlog/',
                pattern: 'oth-yyyy-MM-dd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: { appenders: ['stdout', 'req'], level: 'debug' },//appenders:采用的appender,取appenders项,level:设置级别
            err: { appenders: ['stdout', 'err'], level: 'error' },
            oth: { appenders: ['stdout', 'oth'], level: 'info' }
        }
    };
    log4js.configure(config);
    this.errorLogger = log4js.getLogger('error');
    this.resLogger = log4js.getLogger('response');
}

let formatError = (ctx, err, costTime) => {
    let method = ctx.method,
        url = ctx.url,
        body = ctx.request.body,
        userAgent = ctx.header.userAgent,
        header = ctx.header;
    return { method, url, header, body, costTime, err };
}

function formatRes(ctx, costTime) {
    let methond = ctx.methond,
        url = ctx.url,
        body = ctx.request.body,
        response = ctx.response,
        data = response.body ? JSON.stringify(response.body.data) : '{}',
        header = ctx.header,
        time = timeService.nowFormatStr(),
        ipAddress = ctx.request.ip || ctx.request.ips;
    return { methond, url, header, body, costTime, ipAddress, response, data };
}

LogUtil.prototype.logError = (ctx, error, resTime) => {
    if (ctx && error) {
        this.errorLogger.error(formatError(ctx, error, resTime))
    } 
}

LogUtil.prototype.logRes = (ctx, resTime) => {
    if (ctx) {
        this.resLogger.info(formatRes(ctx, resTime));
    }
}

module.exports = new LogUtil();