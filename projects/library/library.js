var urlListBooks = getUrl('http://localhost:8080/', 'https://prog-tools.ru:8445/') + 'library/rest/books';
var urlDownloadLinkBook = getUrl('http://localhost:8080/', 'https://prog-tools.ru:8445/') + 'library/rest/books/book/link';

Ext.create('Ext.data.Store', {
    storeId: 'bookStore',
    fields: ['name', 'id', 'size', 'group'],
    autoLoad: true,
    // groupField: 'group',
    proxy: {
        type: 'ajax',
        url: urlListBooks,
        reader: {
            type: 'json',
            root: 'books'
        }
    }
});

// var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
//     groupHeaderTpl: '{name} ({rows.length})', //print the number of items in the group
//     startCollapsed: true // start all groups collapsed
// });

var bookGrid = Ext.create('Ext.grid.Panel', {
    store: Ext.data.StoreManager.lookup('bookStore'),
    region: 'center',
    // features: [groupingFeature],
    columns: [
        {text: 'Раздел', dataIndex: 'group'},
        {text: 'Название', dataIndex: 'name', flex: 1},
        {text: 'Размер', dataIndex: 'size'},
        {
            xtype: 'actioncolumn',
            width: 30,
            sortable: false,
            menuDisabled: true,
            items: [{
                icon: 'img/download-16.png',
                tooltip: 'Получить ссылку',
                scope: this,
                handler: function (grid, rowIndex) {
                    var record = grid.getStore().getAt(rowIndex);
                    var data = record.data;
                    var window = Ext.create('Ext.window.Window', {
                        title: 'Получить ссылку на скачивание книги: ' + data.name,
                        // height: 200,
                        width: 600,
                        layout: 'fit',
                        items: {
                            xtype: 'form',
                            border: false,
                            padding: 5,
                            url: urlDownloadLinkBook,
                            layout: {
                                type: 'vbox',
                                align: 'center',
                                pack: 'center'
                            },
                            items: [
                                {
                                    xtype: 'label',
                                    html: '<p style="text-align:center">Получить ссылку на скачивание книги:<br><b>' + data.name + '</b><br/>Размер: <b>' + data.size + '</b></p>',
                                    padding: 5,
                                },
                                {
                                    xtype: 'textfield',
                                    padding: 5,
                                    hidden: true,
                                    name: 'id',
                                    value: data.id
                                },
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Логин',
                                    name: 'login',
                                    allowBlank: false

                                },
                                {
                                    xtype: 'textfield',
                                    emptyText: 'Пароль',
                                    inputType: 'password',
                                    name: 'password',
                                    allowBlank: false

                                },
                                {
                                    xtype: 'button',
                                    text: 'Получить ссылку',
                                    handler: function () {
                                        var form = this.up('form').getForm();
                                        if (form.isValid()) {
                                            var cmpLabel = Ext.getCmp('linkDownload');
                                            var cmpQr = Ext.getCmp('qrDownload');
                                            form.submit({
                                                success: function (form, action) {
                                                    var link = action.result.url;
                                                    var qr = action.result.qr;
                                                    cmpLabel.setText('<a target="_blank" href=\"' + link + '\">Скачать</a>', false);
                                                    cmpQr.setText('<a target="_blank" href=\"' + qr + '\">QR Code</a>', false);
                                                    cmpLabel.setVisible(true);
                                                    cmpQr.setVisible(true);
                                                },
                                                failure: function (form, action) {
                                                    cmpLabel.setText(action.result.msg);
                                                    cmpLabel.setVisible(true);
                                                    cmpQr.setVisible(false);
                                                }
                                            });
                                        }
                                    }

                                },
                                {
                                    xtype: 'label',
                                    text: '',
                                    padding: 5,
                                    id: 'linkDownload',
                                    hidden: true,
                                },
                                {
                                    xtype: 'label',
                                    padding: 5,
                                    id: 'qrDownload',
                                    hidden: true,
                                },
                            ]

                        }
                    }).show();
                }
            }
            ]
        }
    ],
    tbar: [
        {
            xtype: 'textfield',
            emptyText: 'Поиск по разделу',
            width: 500,
            enableKeyEvents: true,
            listeners: {
                keydown: function (object, e, eOpts) {
                    if (e.keyCode === 13) {
                        var value = object.getValue();
                        setFilterCommon(bookGrid.getStore(), value, "group");
                    }
                }
            }
        },
        {
            xtype: 'textfield',
            emptyText: 'Поиск по названию',
            width: 500,
            enableKeyEvents: true,
            listeners: {
                keydown: function (object, e, eOpts) {
                    if (e.keyCode === 13) {
                        var value = object.getValue();
                        setFilterCommon(bookGrid.getStore(), value, "name");
                    }
                }
            }
        },
        {
            xtype: 'button',
            text: 'Обновить',
            handler: function () {
                bookGrid.getStore().reload();
            }
        }
    ],
});

function setFilterCommon(store, searchText, propertyNameForSearch) {
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


var basicLibraryPanel = Ext.create('Ext.panel.Panel', {
    title: 'Библиотека',
    layout: 'border',
    items: [
        bookGrid
    ]
});
