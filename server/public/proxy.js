/**
 * @fileoverview
 * @author czy88840616 <czy88840616@gmail.com>
 *
 */
$(function () {
    $('.J_RuleEnabled').each(function(idx, el){
        if($(el).attr('data-enable') == 'true') {
            $(el).attr('checked', 'checked')
        }
    });

    $('#J_SortRules').dragsort();

    //添加代理域名转ip
    $('#J_AddNewDomain').click(function(e){
        e.preventDefault();
        if(!$('#J_Domain').val()) {
            alert('请填写待替换的域名再尝试添加');
            return;
        }

        $.post('/proxy/addDomain', {
            domain:$('#J_Domain').val(),
            proxyDomain:$('#J_ProxyIp').val()
        }, function(data){
            if(data.success) {
                location.reload();
            } else {
                alert(data.msg);
            }
        });
    });

    $('.J_RemoveDomain').click(function(e){
        e.preventDefault();
        $.post('/proxy/removeDomain', {
            domain:$(this).parent().children('.J_Domain').val()
        }, function(data){
            if(data.success) {
                location.reload();
            } else {
                alert(data.msg);
            }
        });
    });

    $('#J_AddNewRule').click(function(e){
        e.preventDefault();
        if(!$('#J_Pattern').val()) {
            alert('请填写匹配正则或者字符串再尝试添加');
            return;
        }
        $.post('/proxy/addRule', {
            pattern:$('#J_Pattern').val(),
            target:$('#J_Target').val(),
            charset: $('#J_Charset').attr('checked') ? 'utf-8' : 'gbk'
        }, function(data){
            if(data.success) {
                location.reload();
            } else {
                alert(data.msg);
            }
        });
    });

    $('#J_Save').click(function(e){
        e.preventDefault();
        var rules = [];
        $('#J_SortRules .J_Sort').each(function(idx, el){
            rules.push({
                pattern: $('.J_RulePattern', el).val(),
                target: $('.J_RuleTarget', el).val(),
                charset: $('.J_RuleCharset', el).attr('checked') ? 'utf-8' : 'gbk',
                enable: !!$('.J_RuleEnabled', el).attr('checked')
            });
        });

        $.post('/proxy/updateRule', {
            rules: JSON.stringify(rules)
        }, function(data){
            if(data.success) {
                location.reload();
            } else {
                alert(data.msg);
            }
        });
    });

    $('.J_RuleRemove').click(function(ev){
        ev.preventDefault();
        $(this).parent().remove();
    });

    $('input').iCheck({
        checkboxClass: 'icheckbox_minimal-blue rule-check',
        radioClass: 'iradio_minimal-blue',
        increaseArea: '20%' // optional
    });

    $('#J_CheckUrl').click(function(ev){
        ev.preventDefault();
        $.post('/proxy/checkRule', {
            url: $('#J_CheckUrlValue').val()
        }, function(data){
            if(data.success) {
                var result = data.result || {}, html=[];
                $.each(result, function(k, v){
                    html.push('匹配到规则 ');
                    html.push(k);
                    html.push(' => 代理结果为 ');
                    html.push(v);
                    html.push('<br>');
                });

                $('#J_CheckResult').html(html.join('') || '没有匹配到规则');
            } else {
                alert(data.msg);
            }
        });
    });
});
