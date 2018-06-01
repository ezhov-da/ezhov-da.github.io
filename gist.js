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
        },
        
        tbar: ['Поиск по названию:',{
                 xtype: 'textfield',
                 name: 'searchField',
                 hideLabel: true,
                 width: 200,
                 listeners: {
                     change: {
                         fn: function( textField, newValue, oldValue, eOpts){
                             if(newValue === ''){
                                 store.clearFilter();
                                 console.log("clear");
                             } else {
                                //store.filter("name", newValue);
                                store.filter([{
                                        filterFn: function(item) {
                                            //console.log("in filter");
                                            //console.log(item.get("name"));
                                            return isNameContains(item.get("name"), newValue); 
                                        }
                                }]);
                                //console.log("set");
                             }
                             //console.log(newValue);
                         },
                         scope: this,
                         buffer: 100
                     }
                 }
            }],        
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
