//экранирование сырых данных
var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

var panelTextRaw = Ext.create('Ext.panel.Panel', {
    title: 'Подробный просмотр',
    layout: 'fit',
    region: 'south',
    height: '50%',
    collapsible: true,
    collapsed: true,
    split: true,
    id: 'detailViewer',
    autoScroll: true,
    items: []
});

Ext.define('Gists', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'name',
        type: 'string'
    }, {
        name: 'description',
        type: 'string'
    }, {
        name: 'rawUrl',
        type: 'string'

    }, {
        name: 'url',
        type: 'string'
    }, {
        name: 'public',
        type: 'bool'
    }]
});

Ext.define('CategoryStore', {
    extend: 'Ext.data.Model',
    fields: [
    {
        name: 'name',
        type: 'string'
    },
    {
        name: 'count',
        type: 'int'
    }
    ]
});

var store = Ext.create('Ext.data.Store', {
    model: 'Gists',
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'knowledges'
        }
    }
});

var categoryStore = Ext.create('Ext.data.Store', {
    model: 'CategoryStore',
    sorters: {
        property: 'count',
        direction: 'desc'
    },
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            root: 'context'
        }
    }
});

function isNameContains(sourceString, filterText) {
    var booleanContains = false;
    if (filterText !== '') {
        if (filterText.indexOf(' ') !== -1) {
            //получаем массив слов
            var arrayFindWords = filterText.trim().split(' ');
            booleanContains = true;
            for (findWord in arrayFindWords) {
                if (findWord !== '') {
                    if (sourceString.indexOf(arrayFindWords[findWord]) === -1) {
                        booleanContains = false;
                        break;
                    }
                }
            }
        } else {
            booleanContains =
                sourceString
                    .toLowerCase()
                    .indexOf(filterText.toLowerCase()) !== -1;
        }
    } else {
        booleanContains = true;
    }

    return booleanContains;
}

function setFilter(searchText, propertyNameForSearch) {
    if (searchText === '') {
        store.clearFilter();
    } else {
        store.clearFilter();
        store.filter([{
            filterFn: function (item) {
                return isNameContains(item.get(propertyNameForSearch), searchText);
            }
        }]);
    }
}

var categoryTable = Ext.create('Ext.grid.Panel', {
    title: 'Список категорий',
    store: categoryStore,
    width: '20%',
    region: 'west',
    collapsible: true,
    collapsed: false,
    split: true,
    columns: [
    {
        header: 'Название',
        flex: 1 /*резиновый столбец*/,
        dataIndex: 'name'
    }, {
        header: 'кол-во',
        dataIndex: 'count',
    }
    ],

    listeners: {
        select: function (grid, record, index, eOpts) {
            var name = record.data.name;
            Ext.getCmp('textFieldName').setValue(name);
            setFilter(name, "name");
        }
    },
});

var categoryTree = Ext.create('Ext.tree.Panel', {
    title: 'Дерево категорий',
    width: '20%',
    region: 'east',
    collapsible: true,
    collapsed: false,
    rootVisible: false,
    split: true,
    listeners: {
        select: function (tree, record) {
            var name = record.data.name;
            Ext.getCmp('textFieldName').setValue(name);
            setFilter(name, "name");
        }
    },
});

var table = Ext.create('Ext.grid.Panel', {
    title: 'Gists',
    height: 200,
    width: 400,
    store: store,
    region: 'center',
    columns: [{
        xtype: 'rownumberer' /*нумерация строк*/
    }, {
        header: 'Название',
        flex: 2 /*резиновый столбец*/,
        dataIndex: 'name',
        renderer: function (v) {
            return v.replace(/-/g, ' • ');
        }
    }, {
        header: 'Описание',
        flex: 2,
        dataIndex: 'description',
    }, {
        header: 'URL',
        flex: 1,
        dataIndex: 'url',
        renderer: function (v) {
            return '<a target="_blank" href="' + v.toString() + '">Редактировать</a>';
        },
    }, {
        header: 'Сырое URL',
        flex: 1,
        renderer: function (v) {
            return '<a target="_blank" href="' + v.toString() + '">Сырые данные</a>';
        },
        dataIndex: 'rawUrl'
    },
//    {
//        header: 'Публичный',
//        dataIndex: 'public'
//    },
    {
          header: '...',
          width: 30,
          xtype: 'actioncolumn',
          items: [{
                icon: 'img/adept_preview_16x16.png',
                tooltip: 'Просмотр в отдельном окне',
                handler: function(grid, rowIndex, colIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    var data = record.getData();
                    var rawUrl = data.rawUrl;
                    var name = data.name;
                    Ext.Ajax.request({
                        url: rawUrl,
                        timeout: 60000,
                        success: function (response) {
                            var responseText = response.responseText;
                            var codeClass = 'txt';
                            var index = name.lastIndexOf(".");
                            if (index > -1) {
                                codeClass = name.substring(index);
                            }
                            var htmlText = '<pre><code class="' + codeClass + '">' + escapeHtml(responseText) + '</code></pre>';
                            var he = $(window).height();
                            var wi = $(window).width();

                            var heWindow = he - (he * 0.2);
                            var wiWindow = wi - (wi * 0.2);

                            Ext.create('Ext.window.Window', {
                                title: data.name,
                                height: heWindow,
                                width: wiWindow,
                                layout: 'border',
                                modal: true,
                                items: {
                                    xtype: 'panel',
                                    region: 'center',
                                    autoScroll: true,
                                    html: htmlText,
                                },
                                listeners:
                                {
                                    show: function()
                                    {
                                        this.removeCls("x-unselectable");
                                    }
                                }
                            }).show();
                            $(document).ready(function () {
                                $('pre code').each(function (i, block) {
                                    hljs.highlightBlock(block);
                                });
                            });
                        },
                        failure: function (response) {
                            alert("Упс, что то пошло не так :)");
                            //console.log(response);
                        }
                    });
                }
          }]
      }
    ],

    listeners: {
        select: function (grid, record, index, eOpts) {
            var data = record.getData();
            var rawUrl = data.rawUrl;
            var name = data.name;
            Ext.Ajax.request({
                url: rawUrl,
                timeout: 60000,
                success: function (response) {
                    var cmp = Ext.getCmp('detailViewer');
                    var responseText = response.responseText;
                    var codeClass = 'txt';
                    var index = name.lastIndexOf(".");
                    if (index > -1) {
                        codeClass = name.substring(index);
                    }
                    cmp.update('<div><pre><code class="' + codeClass + '">' + escapeHtml(responseText) + '</code></pre></div>');
                    $(document).ready(function () {
                        $('pre code').each(function (i, block) {
                            hljs.highlightBlock(block);
                        });
                    });
                    if (panelTextRaw.collapsed) {
                        panelTextRaw.expand();
                    }
                },
                failure: function (response) {
                    alert("Упс, что то пошло не так :)");
                    //console.log(response);
                }
            });
        }
    },
});

var basicPanelGist = Ext.create('Ext.panel.Panel', {
    title: 'Мои GIST',
    layout: 'border',
    items: [
        categoryTable,
        {
            xtype: 'panel',
            layout: 'border',
            region: 'center',
            items: [
                table,
                panelTextRaw
            ]
        },
        categoryTree
    ],
    tbar: [
        'Введите слово или слова через пробел и нажмите "Enter" >>',
        {
            xtype: 'textfield',
            name: 'searchField',
            id: 'textFieldName',
            enableKeyEvents: true,
            hideLabel: true,
            emptyText: 'Поиск по названию',
            width: 200,
            listeners: {
                keydown: function (object, e, eOpts) {
                    if (e.keyCode === 13) {
                        var value = object.getValue();
                        setFilter(value, "name");
                    }
                }
            }
        },
        {
            xtype: 'textfield',
            name: 'searchField',
            enableKeyEvents: true,
            emptyText: 'Поиск по описанию',
            hideLabel: true,
            width: 200,
            listeners: {
                keydown: function (object, e, eOpts) {
                    if (e.keyCode === 13) {
                        var value = object.getValue();
                        setFilter(value, "description");
                    }
                }
            }
        }, {
            xtype: 'button',
            text: 'Обновить',
            handler: function(){loadGistData();}
        }
    ],
});

function loadGistData(){
    var ajax = new Ext.data.Connection({
        listeners: {
            beforerequest: function(){
                Ext.getBody().mask("Получение данных...");
            },
            requestcomplete: function(){
                Ext.getBody().unmask();
            },
            requestexception: function(){
                Ext.getBody().unmask();
            }

        }
    });
    ajax.request({
//        url: getUrl('http://localhost:64646/knowledges', 'https://prog-tools.ru:64646/knowledges'),
        url: getUrl('https://prog-tools.ru:64646/knowledges', 'https://prog-tools.ru:64646/knowledges'),
        method: 'GET',
        success: function (response) {
            var dataJson = Ext.decode(response.responseText);
            store.loadData(dataJson.knowledges);
            categoryStore.loadData(dataJson.tableContext);
                        var storeTree = Ext.create('Ext.data.TreeStore', {
                            root: dataJson.treeContext
                        });
                        categoryTree.setStore(storeTree);
        },
        failure: function (response) {
            console.log(response);
        }
    });
}




