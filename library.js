Ext.create('Ext.data.Store', {
    storeId:'bookStore',
    fields:['name', 'link'],
    data:{'books':[
        { 'name': 'Java',  "link":"11111111111"},
        { 'name': 'Android',  "link":"11111111111"},
        { 'name': 'Java EE', "link":"11111111111"},
        { 'name': 'C#', "link":"11111111111"}
    ],
    lastUpdate: 'now'
    },
    proxy: {
        type: 'memory',
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
        { text: 'Название',  dataIndex: 'name', flex: 1 },
        {
            xtype: 'actioncolumn',
            width: 30,
            sortable: false,
            menuDisabled: true,
            items: [{
                icon: 'https://cdn.corp.tander.ru/libs/fugue/icons/download.png',
                tooltip: 'Скачать книгу',
                scope: this,
                handler: function(grid, rowIndex){
                    console.log("click");
                    var record = bookGrid.getStore().getAt(rowIndex);
                    var data = record.data;
                    console.log(record);
                    console.log(data);                       
                    var window = Ext.create('Ext.window.Window', {
                        title: 'Скачать книгу: ' + data.name,
                        height: 200,
                        width: 400,
                        layout: 'fit',
                        items:
                            {
                                xtype: 'panel',
                                border: false,
                                padding: 5,
                                layout: {
                                        type: 'vbox',
                                        align: 'center',
                                        pack: 'center'
                                    },
                                items: [
                                    {
                                        xtype: 'label',
                                        text: 'Скачать книгу: ' + data.name,
                                        padding: 5,
                                    },
                                    {
                                        xtype: 'textfield',
                                        emptyText: 'Логин'
                                        
                                    },
                                    {
                                        xtype: 'textfield',
                                        emptyText: 'Пароль'
                                        
                                    },
                                    {
                                        xtype: 'button',
                                        text: 'Скачать'
                                        
                                    }
                                ]
                                
                            }
                        }).show();
                    }
                }
            ]
        }
    ],
});

var basicLibraryPanel = Ext.create('Ext.panel.Panel', {
    title: 'Библиотека',
    layout: 'border',
    items: [
        bookGrid,
    ],
});
