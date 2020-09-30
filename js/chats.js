$(function() {
    // 初始化右侧滚动条
    // 这个方法定义在scroll.js中
    resetui();

    // 1. 渲染用户信息DOM操作
    $('#btnSend').on('click', function() {
        // 非空校验
        var text = $('#ipt').val().trim();
        if (text == '') {
            alert('内容不能为空,请重新输入!');
            $('#ipt').val('');
            return;
        }
        // 渲染到页面上
        $('.talk_list').append(`
            <li class="right_word">
                <img src="img/person02.png" />
                <span>${text}</span>
            </li>
        `);
        // 清空 获取输入框光标 滚动条重置
        $('#ipt').val('');
        $('#ipt').focus();
        resetui();
        // 调用函数 机器人回复
        getMsg(text);
    });

    // 2. 封装一个函数 机器人回复
    function getMsg(text) {
        $.get('http://www.liulongbin.top:3006/api/robot', {
            spoken: text
        }, function(res) {
            if (res.message !== 'success') {
                return alert('获取机器人回复失败');
            }
            // 渲染到页面上
            var msg = res.data.info.text;
            $('.talk_list').append(`
                    <li class="left_word">
                        <img src="img/person01.png" />
                        <span>${msg}</span>
                    </li>
                `);
            // 滚动条重置
            resetui();
            // 调用 getVoice 函数，把文本转化为语音
            getVoice(msg);
        })
    }

    // 3. 语音转换
    function getVoice(text) {
        $.ajax({
            method: 'GET',
            url: 'http://www.liulongbin.top:3006/api/synthesize',
            data: {
                text: text,
            },
            success: function(res) {
                if (res.status !== 200) return alert('语音转换失败');
                $('audio').attr('src', res.voiceUrl);
            }
        })
    }

    // 4. 为文本绑定keyup事件 使用回车键发送消息
    $('#ipt').on('keyup', function(e) {
        if (e.keyCode == 13) {
            $('#btnSend').click();
        }
    })

});