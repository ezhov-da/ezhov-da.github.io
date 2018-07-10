var panelTextRaw = Ext.create('Ext.panel.Panel', {
    title: 'Подробный просмотр',
    layout: 'fit',
    region: 'east',
    width: '30%',
    collapsible: true,
    split: true,
    items: [{
        xtype: 'textareafield',
        grow: true,
        id: 'idRawTextArea',
        name: 'message',
        anchor: '100%',
        fieldStyle : {
            'font-family': 'monospace',
            'font-style': 'normal',
            'font-variant': 'normal',
            'font-weight': '500',
            'line-height': '26.4px'
        }
    }]
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

var store = Ext.create('Ext.data.Store', {
    model: 'Gists',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        //url: 'j.json',
        url: 'https://prog-tools.ru:64646/knowledges',
        reader: {
            type: 'json',
            root: 'knowledges'
        }
    }
});

function isNameContains(sourceString, filterText) {
    var booleanContains = false;
    if (filterText != '') {
        if (filterText.indexOf(' ') !== -1) {
            //получаем массив слов
            var arrayFindWords = filterText.trim().split(' ');

            booleanContains = true;
            for (findWord of arrayFindWords) {
                if (findWord != '') {
                    if (sourceString.indexOf(findWord) == -1) {
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
        flex: 1 /*резиновый столбец*/,
        dataIndex: 'name'
    }, {
        header: 'Описание',
        flex: 1,
        dataIndex: 'description',
    }, {
        header: 'URL',
        dataIndex: 'url',
        renderer: function (v) {
            return '<a target="_blank" href="' + v.toString() + '">Редактировать</a>';
        },
    }, {
        header: 'Сырое URL',
        renderer: function (v) {
            return '<a target="_blank" href="' + v.toString() + '">Сырые данные</a>';
        },
        dataIndex: 'rawUrl'
    }, {
        header: 'Публичный',
        dataIndex: 'public'
    }],

    listeners: {
        select: function (grid, record, index, eOpts) {
            //console.log(index);
            //console.log(record);

            var rawUrl = record.getData().rawUrl;

            Ext.Ajax.request({
                url: rawUrl,
                timeout: 60000,
                success: function (response) {
                    Ext.getCmp('idRawTextArea').setValue(response.responseText);
                    //console.log(response.responseText);
                },
                failure: function (response) {
                    alert("Упс, что то пошло не так :)");
                    //console.log(response);
                }
            });

        }
    },

    tbar: ['Введите слово или слова через пробел и нажмите "Enter" >>', 'Поиск по названию:', {
        xtype: 'textfield',
        name: 'searchField',
        enableKeyEvents: true,
        hideLabel: true,
        width: 200,
        listeners: {
            keydown: function (object, e, eOpts) {
                if (e.keyCode == 13) {
                    var value = object.getValue();
                    setFilter(value, "name");
                }
            }
        }
    }, 'Поиск по описанию:', {
        xtype: 'textfield',
        name: 'searchField',
        enableKeyEvents: true,
        hideLabel: true,
        width: 200,
        listeners: {
            keydown: function (object, e, eOpts) {
                if (e.keyCode == 13) {
                    var value = object.getValue();
                    setFilter(value, "description");
                }
            }
        }
    }, {
        xtype: 'button',
        text: 'reload',
        handler: function () {
            store.reload();
        }
    }],
});

var basicPanelGist = Ext.create('Ext.panel.Panel', {
    title: 'Мои GIST',
    layout: 'border',
    items: [
        table,
        panelTextRaw
    ]
});
