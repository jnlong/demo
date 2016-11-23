'use strict';
(function (window, document) {
    var flashData = CONFIG.flashData;

    // 渲染模板
    function tplToHtml(tplId, tagId, data) {
        var tpl = $('#' + tplId).html();
        var template = _.template(tpl);
        var html = template(data);
        $('#' + tagId).html(html);
    }

    function render(data) {
        tplToHtml('J_listTpl', 'J_list', data);
    }

    // 监听鼠标滑入、滑出事件（使用事件委托）
    $('#J_list').on('mouseover', '.list-img', function (e) {
        $(this).siblings('.list-content').show();
    }).on('mouseout', '.list-img', function (e) {
        $(this).siblings('.list-content').hide();
    });
    
    flashData && render(flashData);
})(window, document);
