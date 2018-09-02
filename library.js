var urlListBooks = 'https://prog-tools.ru:8445/library/rest/books';
// var urlListBooks = 'http://localhost:8080/library/rest/books';
var urlDownloadLinkBook = 'https://prog-tools.ru:8445/library/rest/books/book/link';
// var urlDownloadLinkBook = 'http://localhost:8080/library/rest/books/book/link';

Ext.create('Ext.data.Store', {
    storeId: 'bookStore',
    fields: ['name', 'id'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        //url: 'j.json',
        url: urlListBooks,
        reader: {
            type: 'json',
            root: 'books'
        }
    }
});

var bookGrid = Ext.create('Ext.grid.Panel', {
    store: Ext.data.StoreManager.lookup('bookStore'),
    region: 'center',
    columns: [
        {text: 'Название', dataIndex: 'name', flex: 1},
        {
            xtype: 'actioncolumn',
            width: 30,
            sortable: false,
            menuDisabled: true,
            items: [{
                icon: 'download-16.png',
                tooltip: 'Скачать книгу',
                scope: this,
                handler: function (grid, rowIndex) {
                    console.log("click");
                    var record = bookGrid.getStore().getAt(rowIndex);
                    var data = record.data;
                    console.log(record);
                    console.log(data);
                    var window = Ext.create('Ext.window.Window', {
                        title: 'Получить ссылку на скачивание книги: ' + data.name,
                        height: 200,
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
                                    text: 'Получить ссылку на скачивание книги: ' + data.name,
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
                                    xtype: 'label',
                                    text: '',
                                    padding: 5,
                                    id: 'linkDownload',
                                    hidden: true,
                                },
                                {
                                    xtype: 'button',
                                    text: 'Получить ссылку',
                                    handler: function () {
                                        var form = this.up('form').getForm();
                                        if (form.isValid()) {
                                            var cmplabel = Ext.getCmp('linkDownload');
                                            form.submit({
                                                success: function (form, action) {
                                                    var link = action.result.url;
                                                    cmplabel.setVisible(true);
                                                    cmplabel.setText('<a target="_blank" href=\"' + link + '\">Скачать</a>', false);
                                                },
                                                failure: function (form, action) {
                                                    cmplabel.setVisible(true);
                                                    cmplabel.setText(action.result.msg);
                                                }
                                            });
                                        }
                                    }

                                }
                            ]

                        }
                    }).show();
                }
            }
            ]
        }
    ]
});

var basicLibraryPanel = Ext.create('Ext.panel.Panel', {
    title: 'Библиотека',
    layout: 'border',
    items: [
        bookGrid
    ]
});
