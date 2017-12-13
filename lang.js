(function () {
    var getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]); return null;
    };

    //当前语言
    var lang = getUrlParam("lang") || 'en';

    //语言定义
    var lang_en = {
        spec: 'spec-en.min.js',
        ids: {
            "title": "Menu Config Web Editor",
            "website": "Project Website=>",
            "toggleLang": "<=中文版",
            "toggle": "Toggle Style",
            "import": "Import",
            "export": "Export",
            "select": "Select All",
            "logo": 'kongkongye',
        },
        langs: {
            10: "Config error!",
            20: 'Menu xml config file content',
        }
    };
    var lang_cn = {
        spec: 'spec-cn.min.js',
        ids: {
            "title": "菜单配置网页编辑器",
            "website": "项目主页=>",
            "toggleLang": "<=English Version",
            "toggle": "切换样式",
            "import": "导入",
            "export": "导出",
            "select": "全选",
            "logo": '空空叶',
        },
        langs: {
            10: "配置错误!",
            20: '菜单xml配置文件内容',
        }
    };
    var langs = {
        en: lang_en,
        cn: lang_cn,
    };

    /**
     * 切换语言
     */
    window.toggleLang = function () {
        if (lang === 'en') {
            lang = 'cn';
        }else {
            lang = 'en';
        }

        //更换页面
        window.location.href = window.location.protocol+"//"+window.location.hostname+":"+window.location.port+window.location.pathname+"?lang="+lang;
    };

    //更新显示
    $(function () {
        var langDef = langs[lang];
        //id对应元素的文本内容
        for (var id  in langDef.ids) {
            var text = langDef.ids[id];
            $("#"+id).text(text);
        }
        //语言
        window.use = function (langId) {
            return langDef.langs[langId];
        };
        //其它
        $("#in").attr('placeholder', use(20));
        //js
        $.getScript(langDef.spec, function () {
            $.getScript('menu.min.js');
        });
    })
})();