var panelSingleResult = {
    title: 'Здесь должно быть динамическое название',
    xtype: 'textareafield',
    closable: true,
    grow: true,
    anchor: '100%'
};


var tabPanel = Ext.create('Ext.tab.Panel', {
    title: 'Результаты',
    items: [panelSingleResult, panelSingleResult]
});

var panelFromSqlToVba = Ext.create('Ext.form.Panel', {
    id: "panelToVba",
    title: 'Сгенерировать вставку кода SQL в VBA',
    items: [
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Настройки',
            defaultType: 'checkboxfield',

            items: [
                {
                    boxLabel: 'Добавить шапку подключения ADODB',
                    name: 'addADODB',
                    inputValue: 'true',
                    id: 'addADODB'
                }, {
                    boxLabel: 'Использовать строку подключения',
                    name: 'useConnectionString',
                    inputValue: 'true',
                    id: 'useConnectionString'
                }, {
                    boxLabel: 'Добавить строку выполнение запроса ADODB',
                    name: 'addExecuteADODB',
                    inputValue: 'true',
                    id: 'addExecuteADODB'
                }
            ]
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Строка подключения',
            name: 'connectionString',
            labelAlign: 'left'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Переменная запроса',
            name: 'variable',
            labelAlign: 'left'
        },
        {
            xtype: 'textareafield',
            grow: true,
            name: 'query',
            fieldLabel: 'Внесите текст, который необходимо преобразовать:',
            anchor: '100%'
        }
    ],
    // кнопки формы
    buttons: [{
        text: 'Преобразовать',
        handler: function () {
            panelFromSqlToVba.getForm().submit({
                url: 'http://localhost:8080/vbasql-service/vbasql/toSql',
                method: 'POST',
                success: function (form, action) {
                    Ext.MessageBox.alert('Авторизация пройдена. ', "GOOD");
                },
                failure: function (form, action) {
                    Ext.MessageBox.alert('Ошибка авторизации. ', action.failureType);
                }
            });
        }
    }]
});

var panelFromVbaToSql = Ext.create('Ext.form.Panel', {
    id: "panelToSql",
    title: 'Извлечь SQL из VB',
    split: true,
    items: [
        {
            xtype: 'textareafield',
            grow: true,
            name: 'query',
            fieldLabel: 'Внесите текст, который необходимо изъять:',
            anchor: '100%'
        }
    ],
    // кнопки формы
    buttons: [{
        text: 'Изьять',
        handler: function () {
            panelFromVbaToSql.getForm().submit({
                url: 'http://localhost:8080/vbasql-service/vbasql/toVba',
                method: 'POST',
                success: function (form, action) {
                    Ext.MessageBox.alert('Авторизация пройдена. ', "GOOD");
                },
                failure: function (form, action) {
                    Ext.MessageBox.alert('Ошибка авторизации. ', action.failureType);
                }
            });
        }
    }]
});

var panelWithToAndFrom = Ext.create('Ext.panel.Panel', {
    layout: 'hbox',
    items: [
        panelFromSqlToVba,
        panelFromVbaToSql
    ]
});

var basicPanel = Ext.create('Ext.panel.Panel', {
    items: [
        panelWithToAndFrom,
        tabPanel
    ]
});

Ext.Ajax.useDefaultXhrHeader = false;

Ext.application({
    name: 'Gists',
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [basicPanel]
        });
    }
});