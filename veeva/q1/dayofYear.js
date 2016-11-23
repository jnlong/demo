function dayOfYear(year, month, day) {
    // 容错校验
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
        return 'parameter error';
    }
    // 每月的天数
    var arr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    // 判断是否闰月
    (isLeapYear(year)) && (arr[1] += 1);
    var len = arr.length;
    // 计算天数
    var totalDay = 0;
    for (var i = 0; i < month - 1; i++) {
        totalDay += arr[i]
    }
    totalDay += day;
    return totalDay;
}

function isLeapYear(year) {
    return (year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0);
}
// 测试
console.log(dayOfYear(2008, 5, 1)); // 122
console.log(dayOfYear(2012, 8, 21)); // 234
console.log(dayOfYear(2016, 10, 5)); // 279
