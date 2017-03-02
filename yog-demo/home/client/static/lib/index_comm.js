$.haoTpl = (function(){
    var cache = {},
        tmpl = function tmpl(str, data){
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                    tmpl(document.getElementById(str).innerHTML) :
                new Function("obj",
                        "var p=[],print=function(){p.push.apply(p,arguments);};" +
                        "with(obj){p.push('" + str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<#").join("\t")
                        .replace(/((^|#>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)#>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("#>").join("p.push('")
                        .split("\r").join("\\'")
                        + "');}return p.join('');");
            return data ? fn( data ) : fn;
        };
    return tmpl
})();
$.screenChange = 'onorientationchange' in window ? 'orientationchange' : 'resize';
$.ajaxCard = function(cardName, para){
    var src = '/hao123_api/api/widget/' + cardName + '/' + para + '?t=' + (new Date()).getTime();
    $.get(src);
}
$.loadedIscroll = function (name, startX) {
    startX = !startX ? 0 : startX;
    var tag = new iScroll(name, {
        vScroll: false,
        x: startX
    });
    return tag;
}
$.urlHavePara = function (url, name) {
    var result = '';
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = url.match(reg);
    if (r != null) {
        result = r[2];
    }
    return result;
};
$.urlRemovePara = function (url, name) {
    var result = '';
    var reg = new RegExp('(/?|&)' + name + '=([^&]*)(&|$)');
    !!reg && (url = url.replace(reg, ''));
    return url;
};
$.tj = function (pos) {
    var strTn = CG.tn ? '&tn=' + CG.tn : '';
    var tj = '/static/tj.gif?level=1&page=' + CG.page + strTn + '&pos=' + pos + '&t=' + (new Date()).getTime();
    (new Image()).src = tj;
};
$.tjStr = function(url, pos){
    return '/j.php?z=2&level=1&qt=tz&ver=' + CG.tjOs + '&page='  + CG.page + '&pos=' + pos+ '&tn=phoenixNest&url=' + encodeURIComponent(url);
}
$.tjChangePos = function(url, pos){
    var spos = $.urlHavePara(url, 'pos');
    if (spos === '') {
        return url;
    }
    return url.replace(spos, pos);
};
$.tjChangeUrl = function (url, changeUrl, addTn) {
    var surl = $.urlHavePara(url, 'url');
    if (surl === '') {
        return url;
    }
    return url.replace(surl, changeUrl) + !!addTn ? '&tn=phoenixNest' : '';
}
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
$.getLocation = function () {
    var lastLoc = 'lastLocTime',
        locName = 'geoCoord',
        cityName = 'geoLocation',
        reLocDay = 7,
        locDay = 365,
        url = 'http://api.map.baidu.com/geocoder/v2/?ak=CF1501b87c62bf946e2e9004b889ea89&callback=renderReverse&output=json';
    // 获取成功，则保留一年；获取失败，7天后重新获取
    (function () {
        var city = $.cookie.get(cityName);
        var resCity;
        var ocSplit;
        if (CONFIG.cityBy == 'setting' && CONFIG.city !="") {
            resCity = CONFIG.city;
        } else if (city !== '') {
            resCity = city;
        } else if ($.cookie.get(lastLoc) === '') {
            geoPosition();
        } else {
            resCity = CONFIG.city;
        }
        resCity !== '' && updateStatus(resCity);
    })();
    function geoPosition() {
        if (navigator.geolocation) {
            // $.tj('getGps');
            navigator.geolocation.getCurrentPosition(function (position) {
                var lat = position.coords.latitude,
                    lng = position.coords.longitude;
                createScript(lat, lng);
            }, function (error) {
                $.cookie.set(lastLoc, (new Date()).getTime().toString(), reLocDay);
                updateStatus(CONFIG.cityIp);
            }, {
                timeout: 5000
            });
        }
    }
    function createScript(lat, lng) {
        var s = document.createElement('script'),
            h = document.getElementsByTagName('head')[0],
            id = 'locationJsonp',
            requestURL = url + '&location=' + lat + ',' + lng;
        // $.tj('getGpsSucc');
        // $.cookie.set(locName, lat + ',' + lng, locDay);
        if (id) {
            (createScript[id]) && h.removeChild(createScript[id]);
            createScript[id] = s;
        }
        s.type = 'text/javascript';
        s.src = requestURL;
        h.appendChild(s);
    }
    window.renderReverse = function (data) {
        var res = data.result,
            city = res.addressComponent.city,
            province = res.addressComponent.province,
            cityCode = res.cityCode,
            addr = 'loc:' + res.location.lng + ',' + res.location.lat + ',city:' +
                city + '--' + res.formatted_address;
        // $.tj('getMapCity');
        $.cookie.set(cityName, city + ',' + province + ',' + cityCode, locDay);
        updateStatus(city);
    };
    function updateStatus(t, e) {
        if (!!t) {
            t = t.split(',')[0];
            t = t.replace('市', '');
            $('.geo-city').html(t + '<em></em>');
        }
    }
};
$.encodeHtml = function(s) {
    return (typeof s != "string") ? s :
        s.replace(/"|&|'|<|>|[\x00-\x20]|[\x7F-\xFF]|[\u0100-\u2700]/g,
            function($0){
                var c = $0.charCodeAt(0), r = ["&#"];
                c = (c == 0x20) ? 0xA0 : c;
                r.push(c); r.push(";");
                return r.join("");
            });
};
$.safari = function(){
    var ua = navigator.userAgent,
        res = false;
    if(ua.indexOf('Android') === -1 && ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)){
        res = true;
    }
    return res;
};
$.randomArr = function(arr, num) {
        var temp_array = [],
            return_array = [];
        for (var index in arr) {
            temp_array.push(arr[index]);
        }
        for (var i = 0; i < num; i++) {
            if (temp_array.length > 0) {
                var arrIndex = Math.floor(Math.random() * temp_array.length);
                return_array[i] = temp_array[arrIndex];
                temp_array.splice(arrIndex, 1);
            } else {
                break;
            }
        }
        return return_array;
};
$.getRandomNum = function(resCount, makeCount) {
    var pre = -1,
        ran = 0,
        newArr = [],
        tmpArr = [];
    for (var i = 0; i < resCount; i++) {
        tmpArr[i] = i;
    };
    for (var i = 0; i < makeCount; i++) {
        newArr[i] = $.randomArr(tmpArr, resCount);
    }
    return newArr;
};
$.getCpmHtml = function (id) {
    var bd = window.baidu_dl_config;
    var wap = document.getElementById(id);
    var arr = [];
    if (!wap || wap.innerHTML !== '') {
        return;
    }
    // bd.rsi0 = Math.min(wap.getBoundingClientRect().width, wap.offsetWidth);
    bd.title = document.title;
    bd.ref = document.referrer;
    bd.ltu = window.location + '';
    bd.t = +new Date;

    var src = 'http://entry.baidu.com/rp/home?js=1&';
    for (var i in bd) {
        arr.push(i + '=' + encodeURIComponent(bd[i]));
    }
    src += arr.join('&');

    var script = '<script type="text/javascript" src="' + src + '"></script>';
    var iframe = '<iframe target="_top"' + ' src="" data-lazy="' + src;
    iframe += '" style="*width: 100%;width:1px;min-width:100%" ';
    iframe += ' height="' + bd.rsi1 + '" scrolling="no" frameborder="0" allowtransparency="true">' + '</iframe>';
    wap.style.height = bd.rsi1 + 'px';
    wap.innerHTML = iframe;
};
$.haoIsJudge = (function(){//判断localStorage支持性
    if(!"localStorage" in window) return false;
    try{
        var ls = localStorage,
            num = new Date().getTime();
        ls.setItem(num,"1");
        if(ls.getItem(num) === "1"){
            ls.removeItem(num);
            return true;
        }else{
            return false;
        }
    }catch(e){
        return false;
    }
})();
$.haoIsFirstVisited = (function(){//用户每天第一次访问
    if(!$.haoIsJudge) return false;
    var ls = localStorage,
        name = 'm_index_fv',
        time = ls.getItem(name) || 0,
        now = new Date(),
        early = new Date(parseInt(time,10));
    if(!time || now.toDateString() !== early.toDateString()){
        ls.setItem(name,now.getTime());
        return true;
    }
    return false;
})();
// 点击记录
$.clickHis = (function(){
    if(!$.haoIsJudge) return false;

    var name = 'm_index_tab';
    var everName = 'm_index_ever';
    var ls = localStorage;
    var data = ls.getItem(name);
    var everData = ls.getItem(everName);
    data = ($.haoIsFirstVisited || data === null) ? (ls.setItem(name, '{}'), {}) : JSON.parse(data);
    everData = (everData === null) ? (ls.setItem(everName, '{}'), {}) : JSON.parse(everData);
    return {
        getData: function (key, dataType) {
            var da = dataType ? everData : data;
            return da[key];
        },
        setData: function (key, value, dataType) {
            var da = dataType ? everData : data;
            var nm = dataType ? everName : name;
            da[key] = value;
            ls.setItem(nm, JSON.stringify(da));
        }
    }
})();
$.lazyLoad = function (images) {
    if(images.size() === 0) return;
    var threshold = 20,
        timer,
        height = window.innerHeight || document.documentElement.clientHeight;

    images = Array.prototype.slice.apply(images);
    function loadImage(img) {
        var src = img.getAttribute('data-lazy');
        img.src = src;
        img.removeAttribute('data-lazy');
       // setTimeout(function(){//部分android浏览器替换src后不显示图片
       //     img.style.display = "block";
       // },350);
    }

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect(),
            viewportHeight = height;
        // if (rect.left >= 0) {
            if (rect.top >= 0) {
                if (rect.top <= viewportHeight) {
                    return true;
                }
            } else {
                if (rect.bottom >= 0) {
                    return true;
                }
            }
        // }
        return false;
    }

    function processLoad() {
        for (var i = 0; i < images.length;) {
            if (isElementInViewport(images[i])) {
                loadImage(images[i]);
                images.splice(i, 1);
            } else {
                i++;
            }
        }
    }

    function handle(e){
        clearTimeout(timer);
        timer = setTimeout(function () {
            processLoad();
            if (images.length === 0) {
                $(window).off(e.type, handle);
                return true;
            }
        }, threshold);
    }

    $(window).on("orientationchange resize",function(){
        setTimeout(function(){
            height = window.innerHeight || document.documentElement.clientHeight;
        },300);
    });

    $(['scroll', 'resize']).each(function (index, eventName) {
        $(window).on(eventName, handle);
    });
    processLoad();
};
$.imgTab = function ($node, op) {
    var $gxImg = $node.children();
    var len = !op.childSize ? $gxImg.children().size() : op.childSize;
    var nodeWidth = (op.cw) * len - op.cs;
    var wpWidth = $node.width();
    var disWidth = wpWidth - nodeWidth;
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    var pos = op.pos || 0;
    var change = function () {
            wpWidth = $node.width();
            disWidth = wpWidth - nodeWidth;
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            $gxImg.css({
                '-webkit-transform': 'translate(0,0) translateZ(0)'
            });
            pos = 0;
        };
    $gxImg.css({
        width: nodeWidth + 'px'
    });
    $node.on('touchstart', function (e) {
        var me = this;
        e.stopPropagation();
        if (disWidth >= 0) {
            return;
        }
        var et = e.touches[0];
        me.startX = et.clientX;
        me.startY = et.clientY;
        me.left = $(this).offset().left;
    }).on('touchmove', function (e) {
        var me = this;
        e.stopPropagation();
        if (disWidth >= 0) {
            return;
        }
        var et = e.touches[0];
        me.disX = et.clientX - me.startX;
        me.disY = et.clientY - me.startY;
        if (Math.abs(me.disX) > Math.abs(me.disY)) {
            e.preventDefault();
            me.dis = pos + me.disX;
            if (me.dis >= 0) {
                $gxImg.css({
                    '-webkit-transform': 'translate(0,0) translateZ(0)'
                });
            } else if (me.dis <= disWidth) {
                $gxImg.css({
                    '-webkit-transform': 'translate(' + disWidth + 'px,0) translateZ(0)'
                });
            } else {
                $gxImg.css({
                    '-webkit-transform': 'translate3d(' + me.dis + 'px,0,0)'
                });
            }
        }
    }).on('touchend', function (e) {
        var me = this;
        e.stopPropagation();
        if (me.dis >= 0) {
            pos = 0;
        } else if (me.dis <= disWidth) {
            pos = disWidth;
        } else {
            pos = me.dis || 0;
        }
        me.startX = me.startY = me.moveX = me.moveY = me.dis = me.disX = me.dis = 0;
    });
    $(window).on($.screenChange, function () {
        setTimeout(change, 200);
    });
};
// 首次显示，用户点击一次后就不再显示
$.firstShow = function(tag, hideTag, lsName){
    var $tag = $(tag),
        $hideTag = $(hideTag);
    if(! $.clickHis){
        return;
    }
    $tag.one('click', function () {
        $.clickHis.setData(lsName, 1);
        $hideTag.hide();
    });
    if ($.clickHis.getData(lsName) === undefined) {
        $hideTag.show();
    }
};
$.tanceng = function (op) {
    var opDef = {tagId: '', timeout: 0, lsName: '', showMask: true, tcCanClick: true};
    var me = this;
    for (var key in op) {
        opDef[key] = op[key];
    }
    for (var key in opDef) {
        me[key] = opDef[key];
    }
    me.tag = $('#' + me.tagId);
    if(me.tag.size() == 0){
        return;
    }
    var pos = me.tag.data('lsname');
    pos = pos || me.tagid;
    me.lsName = 'm_index_hd_' + (!!me.lsName ? me.lsName : pos);
    if(('localStorage' in window) && !localStorage.getItem(me.lsName)) {
        me.init();
    }
}
$.tanceng.prototype = {
    init: function(){
        var me = this;
        me.bg = $('#bg');
        me.tag.show();
        me.addEvnet();
        me.showMask && me.bg.show();
    },
    hide: function(me){
        var me = me || this;
        localStorage.setItem(me.lsName, '1');
        me.tag.hide();
        me.showMask && me.bg.hide();
    },
    addEvnet: function(){
        var me = this;
        var btnclick = me.tag.find('.btnok,.btnclose,.linkwap');
        me.tcCanClick && (btnclick = me.tag);
        me.showMask && btnclick.add(me.bg);
        btnclick.one('click', function () {
            me.hide(me);
        });
        !!me.timeout && !isNaN(me.timeout) && setTimeout(function(){
            me.hide();
        }, me.timeout);
    }
}
new $.tanceng({tagId: 'hdHongbao', showMask: false, tcCanClick: false});