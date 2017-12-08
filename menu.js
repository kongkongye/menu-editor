window.Menu = (function () {
    var WHITE_SPACE = /^\s+$/;

    var mode = "nerd";
    var toggleMode = function () {
        if (mode === 'nerd') {
            mode = 'laic';
        }else {
            mode = 'nerd';
        }
        Xonomy.setMode(mode);
    };
    toggleMode();

    /**
     * 将xml文档转换成字符串
     */
    var convertXmlDocumentToString = function (xmlDocument) {
        return $("<div></div>").append($(xmlDocument.documentElement)).html();
    };

    /**
     * 格式化xml
     */
    var formatXml = function(xml) {
        var formatted = '';
        var reg = /(>)(<)(\/*)/g;
        xml = xml.replace(reg, '$1\r\n$2$3');
        var pad = 0;
        jQuery.each(xml.split('\r\n'), function(index, node) {
            var indent = 0;
            if (node.match( /.+<\/\w[^>]*>$/ )) {
                indent = 0;
            } else if (node.match( /^<\/\w/ )) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
                indent = 1;
            } else {
                indent = 0;
            }

            var padding = '';
            for (var i = 0; i < pad; i++) {
                padding += '  ';
            }

            formatted += padding + node + '\r\n';
            pad += indent;
        });

        return formatted;
    }

    /**
     * 导入修正
     */
    var importFix = function(document, node) {
        for (var i=0; i < node.childNodes.length; i++){
            var current = node.childNodes[i];

            //是文本
            if (current.nodeType === 3) {
                //去除元素间的空白文本
                if (WHITE_SPACE.test(current.nodeValue)) {
                    node.removeChild(current);
                    i--;
                    continue;
                }

                //文本替换为文本元素
                if (current.parentNode.nodeName === 'line') {
                    var textNode = document.createElement('text');
                    textNode.appendChild(document.createTextNode(current.nodeValue));
                    node.replaceChild(textNode, current);
                }
                continue;
            }

            //是元素
            if (current.nodeType === 1) {
                importFix(document, current);
                continue;
            }
        }
    };

    /**
     * 导出修正
     */
    var exportFix = function(node) {
        var i;
        if (node.nodeType === 1) {//元素结点
            //设置xmlns属性
            if (node.nodeName === 'menu') {
                node.setAttribute("xmlns", "http://xsd.kongkongye.com/menu.xsd");
            }

            //删除这个奇怪的多余属性
            node.removeAttribute("xml:space");

            for (i=0; i < node.childNodes.length; i++) {
                exportFix(node.childNodes[i]);
            }
        }else if (node.nodeType === 9) {//文档结点
            for (i=0; i < node.childNodes.length; i++) {
                exportFix(node.childNodes[i]);
            }
        }
    };

    return {
        convertXmlDocumentToString: convertXmlDocumentToString,
        formatXml: formatXml,
        importFix: importFix,
        exportFix: exportFix,
        toggleMode: toggleMode,
    };
})();
