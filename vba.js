function createResultTab(nameTab, text) {
    var textArea = Ext.create('Ext.form.field.TextArea', {
        value: text,
        anchor: '100%',
        grow: true,
        region: 'center',

    });

    var buttonSelectAll = Ext.create('Ext.panel.Panel', {
        region: 'south',
        layout: {
            type: 'vbox',
            align: 'center'
        },
        items: [
            {
                text: 'Выбрать весь текст',
                xtype: 'button',
                handler: function () {
                    textArea.selectText();
                }
            }
        ]
    });

    return {
        title: nameTab,
        xtype: 'panel',
        layout: 'border',
        closable: true,
        items: [textArea, buttonSelectAll]

    };
}

function addNew(objectTab) {
    var objectTabActive = tabPanel.add(objectTab);
    tabPanel.setActiveTab(objectTabActive);
}

function processResponse(tabText, form, action) {
    //console.log(form);
    //console.log(action);
    addNew(createResultTab(tabText, action.result.text));
}

var tabPanel = Ext.create('Ext.tab.Panel', {
    title: 'Результаты',
    region: 'south',
    split: true,
    height: '40%',
    items: []
});

var panelFromSqlToVba = Ext.create('Ext.form.Panel', {
    id: "panelToVba",
    title: 'Сгенерировать вставку кода SQL в VBA',
    region: 'center',
    layout: {
        type: 'vbox',       // Arrange child items vertically
        align: 'stretch',    // Each takes up full width
        padding: 5
    },
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
                    id: 'addADODB',
                }, {
                    boxLabel: 'Использовать строку подключения',
                    name: 'useConnectionString',
                    inputValue: 'true',
                    id: 'useConnectionString',
                }, {
                    boxLabel: 'Добавить строку выполнение запроса ADODB',
                    name: 'addExecuteADODB',
                    inputValue: 'true',
                    id: 'addExecuteADODB',
                }
            ]
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Строка подключения',
            name: 'connectionString',
            labelAlign: 'left',
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Переменная запроса',
            name: 'variable',
            value: 'query',
            labelAlign: 'left',
        },
        {
            xtype: 'textareafield',
            grow: true,
            name: 'query',
            fieldLabel: 'Внесите текст, который необходимо преобразовать:',
            align: 'stretch',
            flex: 10,
            labelAlign: 'top'
        }
    ],
    // кнопки формы
    buttons: [{
        text: 'Преобразовать',
        handler: function () {
            panelFromSqlToVba.getForm().submit({
                waitMsg: 'Обработка данных...',
                url: 'https://prog-tools.ru:8445/vbasql-service/vbasql/toSql',
                method: 'POST',
                success: function (form, action) {
                    processResponse('SQL -> VBA: ' + new Date(), form, action);
                },
                failure: function (form, action) {
                    processResponse('VBA -> SQL: ' + new Date(), form, action);
                },
            });
        }
    }]
});

var panelFromVbaToSql = Ext.create('Ext.form.Panel', {
    id: "panelToSql",
    title: 'Извлечь SQL из VBA',
    region: 'east',
    split: true,
    layout: 'fit',
    width: '50%',
    items: [
        {
            xtype: 'textareafield',
            grow: true,
            name: 'query',
            fieldLabel: 'Внесите текст, который необходимо изъять:',
            labelAlign: 'top'
        }
    ],
    // кнопки формы
    buttons: [{
        text: 'Изьять',
        handler: function () {
            panelFromVbaToSql.getForm().submit({
                url: 'https://prog-tools.ru:8445/vbasql-service/vbasql/toVba',
                method: 'POST',
                success: function (form, action) {
                    processResponse('SQL -> VBA: ' + new Date(), form, action);
                },
                failure: function (form, action) {
                    processResponse('VBA -> SQL: ' + new Date(), form, action);
                }
            });
        }
    }]
});

var panelWithToAndFrom = Ext.create('Ext.panel.Panel', {
    region: 'center',
    layout: 'border',
    items: [
        panelFromSqlToVba,
        panelFromVbaToSql
    ]
});

var basicPanel = Ext.create('Ext.panel.Panel', {
    layout: 'border',
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
