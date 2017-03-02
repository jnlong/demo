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