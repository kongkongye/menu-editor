window.docSpec = (function () {
    /**
     * 删除属性
     */
    var delAttr = {
        caption: 'Delete',
        action: Xonomy.deleteAttribute
    };

    /**
     * 删除元素
     */
    var delEle = {
        caption: 'Delete',
        action: Xonomy.deleteElement
    };

    /**
     * @param desc 属性描述,可选
     * @param noDel true时禁止删除按钮
     */
    var attrMenus = function (desc, noDel) {
        var result = [];
        if (desc) {
            result.push({
                caption: 'Tip: '+desc
            });
        }
        if (!noDel) {
            result.push(delAttr);
        }
        return result;
    };

    var boolParameters = [
        {caption: 'true', value: 'true'},
        {caption: 'false', value: 'false'}
    ];

    /**
     * 添加属性
     * @param caption 标题
     * @param name 属性名
     * @param value 初始值
     * @return {{caption: *, action: *, actionParameter: {name: *, value: *}, hideIf: hideIf}}
     */
    var addAttr = function (caption, name, value) {
        return {
            caption: caption,
            action: Xonomy.newAttribute,
            actionParameter: {name: name, value: value},
            hideIf: function(ele){
                return ele.hasAttribute(name);
            }
        };
    };

    /**
     * 添加子元素
     * @param caption 标题
     * @param {string} ele 添加的元素内容
     * @return {{caption: *, action: *, actionParameter: *}}
     */
    var addChildEle = function (caption, ele) {
        return {
            caption: caption,
            action: Xonomy.newElementChild,
            actionParameter: ele
        };
    };

    var validateInt = function (ele, value) {
        var result = parseInt(value);
        if (isNaN(result) || result+'' !== value) {
            Xonomy.warnings.push({
                htmlID: ele.htmlID,
                text: 'must be int'
            });
            return false;
        }
        return true;
    };

    var getConditionAttr = function () {
        return {
            displayName: 'Condition',
            menu: attrMenus("format: 'conditon name:condition data'"),
            asker: Xonomy.askString,
        };
    };

    var getStyleAttr = function () {
        return {
            displayName: 'Style',
            menu: attrMenus(),
            asker: Xonomy.askString,
        };
    };

    /**
     * 检测初始折叠
     */
    var checkCollapsed = function (ele) {
        return ele.parent().name === 'menu';
    };

    return {
        elements: {
            'menu': {
                displayName: 'Menu',
                attributes: {
                    'condition': {
                        displayName: 'Condition',
                        menu: attrMenus("Join menu will be denied when condition is not satisfied,format: 'conditon name:condition data'"),
                        asker: Xonomy.askString,
                    },
                    'enable': {
                        displayName: 'whether enabled',
                        menu: attrMenus('default is true'),
                        asker: Xonomy.askPicklist,
                        askerParameter: boolParameters,
                    },
                    'title': {
                        displayName: 'Title',
                        menu: attrMenus(),
                        asker: Xonomy.askString,
                    },
                    'pageContext': {
                        displayName: 'Page Context',
                        menu: attrMenus("format: 'page param handler name[:page param handler data]'"),
                        asker: Xonomy.askString,
                    },
                    'listContext': {
                        displayName: 'List Context',
                        menu: attrMenus("format: 'list param handler name[:list param handler data]'"),
                        asker: Xonomy.askString,
                    }
                },
                menu: [
                    {
                        caption: 'add attribute',
                        menu: [
                            addAttr('condition', 'condition', ''),
                            addAttr('whether enabled', 'enable', 'true'),
                            addAttr('title', 'title', ''),
                            addAttr('page context', 'pageContext', ''),
                            addAttr('list context', 'listContext', ''),
                        ]
                    },
                    {
                        caption: 'add sub element',
                        menu: [
                            addChildEle('add line', '<line/>'),
                            addChildEle('add list', '<list/>'),
                            addChildEle('add import', '<import path=""/>'),
                        ]
                    },

                ]
            },
            'line': {
                displayName: 'line',
                attributes: {
                    'condition': getConditionAttr(),
                    'description': {
                        displayName: 'description',
                        menu: attrMenus('separate multiple lines with \\n'),
                        asker: Xonomy.askString,
                    },
                    'sub': {
                        displayName: 'the sub menu belong to',
                        menu: attrMenus('default no belong'),
                        asker: Xonomy.askString,
                    }
                },
                menu: [
                    {
                        caption: 'add attribute',
                        menu: [
                            addAttr('condition', 'condition', ''),
                            addAttr('description', 'description', ''),
                            addAttr('the sub menu belong to', 'sub', ''),
                        ]
                    },
                    {
                        caption: 'add sub element',
                        menu: [
                            addChildEle('add text', '<text/>'),
                            addChildEle('add button', '<button cmd=""/>'),
                            addChildEle('add input', '<input name=""/>'),
                            addChildEle('add sub menu', '<sub/>'),
                        ]
                    },
                    delEle,
                ],
                canDropTo: ['menu', 'list'],
                collapsed: checkCollapsed,
            },
            'list': {
                displayName: 'list',
                attributes: {
                    'condition': getConditionAttr(),
                    'size': {
                        displayName: 'size',
                        menu: attrMenus('list size,>=1'),
                        asker: Xonomy.askString,
                    },
                    'sub': {
                        displayName: 'the sub menu belong to',
                        menu: attrMenus('default no belong'),
                        asker: Xonomy.askString,
                    }
                },
                menu: [
                    {
                        caption: 'add attribute',
                        menu: [
                            addAttr('condition', 'condition', ''),
                            addAttr('size', 'size', '10'),
                            addAttr('the sub menu belong to', 'sub', ''),
                        ]
                    },
                    {
                        caption: 'add sub element',
                        menu: [
                            addChildEle('add line', '<line/>'),
                            addChildEle('add import', '<import path=""/>'),
                        ]
                    },
                    delEle,
                ],
                canDropTo: ['menu'],
                collapsed: checkCollapsed,
            },
            'import': {
                displayName: 'import',
                attributes: {
                    'condition': getConditionAttr(),
                    'path': {
                        displayName: 'menu path',
                        menu: attrMenus("imported menu path,format: '[namespace:]menu path'", true),
                        asker: Xonomy.askString,
                    },
                },
                menu: [
                    {
                        caption: 'add attribute',
                        menu: [
                            addAttr('condition', 'condition', ''),
                        ]
                    },
                    delEle,
                ],
                canDropTo: ['menu', 'list'],
                collapsed: checkCollapsed,
            },
            'text': {
                displayName: 'text',
                attributes: {
                    'condition': getConditionAttr(),
                    'style': getStyleAttr(),
                },
                menu: [
                    {
                        caption: 'add attribute',
                        menu: [
                            addAttr('condition', 'condition', ''),
                            addAttr('style', 'style', ''),
                        ]
                    },
                    delEle,
                ],
                hasText: true,
                oneliner: true,
                canDropTo: ['line'],
                asker: Xonomy.askString,
            },
            'button': {
                displayName: 'button',
                attributes: {
                    'condition': getConditionAttr(),
                    'style': getStyleAttr(),
                    'cmd': {
                        displayName: 'command',
                        menu: attrMenus("default is empty,will not execute command"),
                        asker: Xonomy.askString,
                    },
                    'mode': {
                        displayName: 'mode',
                        menu: attrMenus("the action after executing,default is stay"),
                        asker: Xonomy.askPicklist,
                        askerParameter: [
                            {caption: 'exit menu', value: 'exit'},
                            {caption: 'back menu', value: 'back'},
                            {caption: 'no action', value: 'stay'},
                            {caption: 'refresh page', value: 'refresh'},
                        ]
                    }
                },
                menu: [
                    {
                        caption: 'add attribute',
                        menu: [
                            addAttr('condition', 'condition', ''),
                            addAttr('style', 'style', ''),
                            addAttr('command', 'cmd', ''),
                            addAttr('mode', 'mode', 'stay'),
                        ]
                    },
                    delEle,
                ],
                hasText: true,
                oneliner: true,
                canDropTo: ['line'],
                asker: Xonomy.askString,
            },
            'input': {
                displayName: 'input',
                attributes: {
                    'condition': getConditionAttr(),
                    'style': getStyleAttr(),
                    'name': {
                        displayName: 'input param name',
                        menu: attrMenus(),
                        asker: Xonomy.askString,
                    },
                    'type': {
                        displayName: 'type',
                        menu: attrMenus("param type limit"),
                        asker: Xonomy.askPicklist,
                        askerParameter: [
                            {caption: 'integer', value: 'integer'},
                            {caption: 'real', value: 'real'},
                            {caption: 'string', value: 'string'},
                        ]
                    },
                    'default': {
                        displayName: 'default value',
                        menu: attrMenus(),
                        asker: Xonomy.askString,
                    },
                },
                menu: [
                    {
                        caption: 'add attribute',
                        menu: [
                            addAttr('condition', 'condition', ''),
                            addAttr('style', 'style', ''),
                            addAttr('type', 'type', 'string'),
                            addAttr('default value', 'default', ''),
                        ]
                    },
                    delEle,
                ],
                oneliner: true,
                canDropTo: ['line'],
            },
            'sub': {
                displayName: 'sub menu',
                attributes: {
                    'condition': getConditionAttr(),
                    'style': getStyleAttr(),
                    'name': {
                        displayName: 'sub menu name',
                        menu: attrMenus('default is empty,empty is a normal value too(can not contain @)'),
                        asker: Xonomy.askString,
                    },
                    'default': {
                        displayName: 'init status',
                        menu: attrMenus('default is closed'),
                        asker: Xonomy.askPicklist,
                        askerParameter: [
                            {caption: 'opend', value: 'open'},
                            {caption: 'closed', value: 'closed'},
                        ]
                    },
                    'group': {
                        displayName: 'the sub menu group belong to',
                        menu: attrMenus('default is no group'),
                        asker: Xonomy.askString,
                    },
                },
                menu: [
                    {
                        caption: 'add attribute',
                        menu: [
                            addAttr('condition', 'condition', ''),
                            addAttr('style', 'style', ''),
                            addAttr('sub menu name', 'name', ''),
                            addAttr('init status', 'default', 'closed'),
                            addAttr('the sub menu group belong to', 'group', ''),
                        ]
                    },
                    delEle,
                ],
                oneliner: true,
                canDropTo: ['line'],
            },
        },
        onchange: function () {
            console.log("onchange...")
        },
        validate: function (ele) {
            console.log("validate...")

            //列表的size必须是整数且>=1
            var children = ele.getChildElements('list');
            for (var i in children) {
                if (children.hasOwnProperty(i)) {
                    var child = children[i];
                    var sizeAttr = child.getAttribute('size');
                    if (sizeAttr !== undefined && sizeAttr !== null) {
                        //验证整数
                        if (!validateInt(sizeAttr, sizeAttr.value)) {
                            continue;
                        }
                        //必须大于等于1
                        var size = parseInt(sizeAttr.value);
                        if (size < 1) {
                            Xonomy.warnings.push({
                                htmlID: sizeAttr.htmlID,
                                text: 'must >=1'
                            });
                            continue;
                        }
                    }
                }
            }
        }
    };
})();