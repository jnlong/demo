module.exports.parseRange = function (str, size) {
    if (str.indexOf(",") != -1) {
        return;
    }
    if(str.indexOf("=") != -1){
        var pos = str.indexOf("=")
        var str = str.substr(6, str.length)
    }
    var range = str.split("-");
    var start = parseInt(range[0], 10)
    var end = parseInt(range[1], 10) || size - 1

    if (isNaN(start)) {
        start = size - end;
        end = size - 1;
    } else if (isNaN(end)) {
        end = size - 1;
    }

    if (isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }
    return {
        start: start,
        end: end
    };
};
