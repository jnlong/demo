'use strict';
(function() {
    var isClick;
    var $btnStart = $('#btnStart');
    var $turn = $('#turn');
    var $bg = $('#bg');
    var $tipsInfo = $('#tipsInfo');
    var $tipsMsg = $('#tipsMsg');
    var $tipsFail = $('#tipsFail');
    var $form = $('#form');
    var $btnSubmit = $('#btnSubmit');
    var $tipsBox = $('#tipsBox');
    var prizeList = [
        { id: 1, num: 5, title: 'ipad mini4', src: '' },
        { id: 2, num: 1, title: '100元手机充值卡', src: '' },
        { id: 3, num: 2, title: '无线鼠标', src: '' },
        { id: 4, num: 3, title: 'Hao123小度wifi', src: '' },
    ];
    var prize;
    var res;

    // start 表单验证代码-jquery-validate-demo
    // 添加验证手机号码method
    $.validator.addMethod('mobile',
        function(value, element) {
            return this.optional(element) || /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])[0-9]{8}$/.test(value);
        },
        '请输入有效的手机号码'
    );
    // 自定义中文提示
    $.extend($.validator.messages, {
        required: "这是必填字段",
        remote: "请修正此字段",
        email: "请输入有效的电子邮件地址",
        url: "请输入有效的网址",
        date: "请输入有效的日期",
        dateISO: "请输入有效的日期 (YYYY-MM-DD)",
        number: "请输入有效的数字",
        digits: "只能输入数字",
        creditcard: "请输入有效的信用卡号码",
        equalTo: "你的输入不相同",
        extension: "请输入有效的后缀",
        maxlength: $.validator.format("最多可以输入 {0} 个字符"),
        minlength: $.validator.format("最少要输入 {0} 个字符"),
        rangelength: $.validator.format("请输入长度在 {0} 到 {1} 之间的字符串"),
        range: $.validator.format("请输入范围在 {0} 到 {1} 之间的数值"),
        max: $.validator.format("请输入不大于 {0} 的数值"),
        min: $.validator.format("请输入不小于 {0} 的数值")
    });
    // 初始化validate
    var valid = $form.validate({
        rules: {
            addressee: {
                required: true,
                rangelength: [2, 16]
            },
            mobile: {
                required: true,
                mobile: true,
            },
            address: {
                required: true,
                rangelength: [10, 100]
            }
        },
        //下面定义提示信息：如果messages处，某个控件没有 message，将调用默认的信息（$.validator.messages.required的默认文案）。
        messages: {
            addressee: {
                // required: '姓名是必填字段', 
                rangelength: $.validator.format('请输入{0}到{1}个字符')
            },
            mobile: {
                required: '手机号码是必填字段',
                mobile: '请输入正确的手机号码'
            },
            address: {
                required: '地址是必填字段',
                rangelength: $.validator.format('请输入{0}到{1}个字符')
            }
        },
        remote: {
            url: '/activity/roulette/submit',
            type: 'POST'
        },
        errorPlacement: function(error, element) {
            if (element.is(":radio"))
                error.appendTo(element.parent().next().next());
            else if (element.is(":checkbox"))
                error.appendTo(element.next());
            else
                error.appendTo(element.parent());
        },
        submitHandler: function() {},
        success: function(label) {
            label.addClass("checked");
        },
        highlight: function(element, errorClass) {
            $(element).parent().next().find("." + errorClass).removeClass("checked");
        }
    });
    // 点击提交表单按钮
    $btnSubmit.on('click', function() {
        if (valid.checkForm()) { //调用valid.checkForm进行验证表单
            submit(function() { //通过ajax方式提交表单
                $tipsInfo.hide();
                $tipsMsg.show();
            });
        }
    });
    // ajax方式提交表单，并且根据返回结果弹出相应提示信息
    var submit = function(callback) {
        // 将表单数据转换成json格式
        var arrForm = $form.serializeArray();
        var jsonFrom = {};
        arrForm.forEach(function(v, i) {
            jsonFrom[v.name] = v.value;
        });
        $.ajax({
            url: '', //ajax提交信息地址
            type: 'POST',
            data: jsonFrom,
            success: function(res) {
                if (res && res.code === 0) {
                    callback();
                } else if (res && res.showmessage) {
                    showMessage(res.showmessage);
                } else {
                    showMessage();
                }
            },
            error: function() {
                showMessage();
            }
        });
    };
    // end 表单验证代码-jquery-validate-demo

    // start 其他代码
    function init(isFirst) {
        res = isFirst ? 2 : 0; //抽奖结果
        prize = { num: 4, title: '', src: '' };
        isClick = false;
    };
    init(true);
    var removeAni = function() {
        $turn.css({ 'transition': '', 'transform': '' });
    };
    var showForm = function(index) {
        $bg.show();
        if (index != 0 && index <= prizeList.length) {
            $tipsInfo.find('.des').text(prize.title);
            $tipsInfo.find('.prize').attr('src', prize.src);
            $tipsInfo.show();
        } else {
            $tipsFail.show();
        }
    };
    var showMessage = function(msg) {
        msg = msg || '信息提交失败，请稍后重试！';
        $tipsBox.show().find('.msg').text(msg);
        setTimeout(function() {
            $tipsBox.hide();
        }, 3000);
    };
    // 点击开始抽奖按钮，触发
    var start = function(index) {
        if (isClick) {
            return;
        }
        if (index != 0 && index <= prizeList.length) {
            prize = prizeList[index - 1];
        }
        var goDeg = (36 + prize.num) * 60 + 'deg';
        $turn.css({ 'transition': 'all 6s ease-in-out', 'transform': 'rotateZ(' + goDeg + ')' }); //
        isClick = true;
        setTimeout(function() {
            removeAni();
            showForm(index);
            init();
        }, 7000);
    };
    $btnStart.on('click', function() {
        start(res);
    });
    $('.info .close').on('click', function() {
        $(this).parents('.cn_tips').hide();
        $bg.hide();
    });
    $('#btnMsg,#btnFail').on('click', function() {
        $bg.hide();
        $tipsFail.hide();
        $tipsMsg.hide();
    });
    // end 其他代码
})();
