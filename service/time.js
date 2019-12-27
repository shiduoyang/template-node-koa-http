const moment = require("moment");

function Time() {
    
}

Time.prototype.now = function () {
    return moment().milliseconds();
}

Time.prototype.nowFormatStr = function () {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}

Time.prototype.toString = function (time) {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

module.exports = new Time();