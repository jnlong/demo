$.cookie = {
    get: function (name) {
        var cookieArr = document.cookie.split('; ');
        for (var i = 0, len = cookieArr.length; i < len; i++) {
            var arr = cookieArr[i].split('=');
            if (arr[0] === name) {
                return decodeURIComponent(arr[1]);
            }
        }
        return '';
    },
    set: function (name, value, days) {
        var time = new Date();
        var days = days || 1;
        time.setTime(time.getTime() + days * 86400000);
        document.cookie = name + '=' +  encodeURIComponent(value) + ';expires=' + time.toGMTString() + ';path=/;';
    },
    del: function (name) {
        document.cookie = name + '=;expires=' + (new Date(0)).toGMTString();
    }
};