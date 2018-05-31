var panelTextRaw = Ext.create('Ext.panel.Panel', {
    title: 'Подробный просмотр',
    layout: 'fit',
    region: 'south',
    height: 400,
    collapsible: true,
    split: true,
    items: [{
        xtype     : 'textareafield',
        grow      : true,
        id        : 'idRawTextArea',
        name      : 'message',
        anchor    : '100%'
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
                    url: 'https://prog-tools.ru:64646/git',
                    reader: {
                        type: 'json',
                        root: 'knowledges'
                    }
        }
});

var table = Ext.create('Ext.grid.Panel', {
        title: 'Gists',
        height: 200,
        width: 400,
        store: store,
        region: 'center',
        columns: [{
            xtype:'rownumberer' /*нумерация строк*/
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
            renderer:function(v) {
                return '<a target="_blank" href="' + v.toString() + '">Редактировать</a>';
            },
        }, {
            header: 'Сырое URL',
            renderer:function(v) {
                return '<a target="_blank" href="' + v.toString() + '">Сырые данные</a>';
            },
            dataIndex: 'rawUrl'
        }, {
            header: 'Публичный',
            dataIndex: 'public'
        }],
        
        listeners:{
            select: function(grid, record, index, eOpts){
                //console.log(index);
                //console.log(record);
                
                var rawUrl = record.getData().rawUrl;                
               
                Ext.Ajax.request({
                    url: rawUrl,
                    timeout: 60000,
                    success: function(response){
                        Ext.getCmp('idRawTextArea').setValue(response.responseText);
                        //console.log(response.responseText);
                    },
                    failure: function(response){
                        alert("Упс, что то пошло не так :)");
                        //console.log(response);
                    }
                });
                
            }            
        }
    });

Ext.Ajax.useDefaultXhrHeader = false;

Ext.application({
    name: 'Gists',
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'panel',
                layout: 'border',
                items: [
                    table,
                    panelTextRaw
                ]
            }]
        });
    }
});
