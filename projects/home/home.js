var basicUrl = getUrl('http://localhost:8080/', 'https://prog-tools.ru:8445/');
var urlAuthorizationAndPanel = basicUrl + 'home/rest/admin/panel/show';

var panelLogin = Ext.create("Ext.form.Panel", {
    id: 'panelLogin',
    layout: 'vbox',
    region: 'center',
    width: 200,
    height: 400,
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    url: urlAuthorizationAndPanel,
    items: [
        {
            xtype: 'label',
            html: '<p style="text-align:center">Закрытое пространство</p>',
            padding: 5,
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
            id: 'info',
            hidden: true
        },
        {
            xtype: 'button',
            text: 'Войти',
            handler: function () {
                var info = Ext.getCmp('info');
                var form = this.up('form').getForm();
                if (form.isValid()) {
                    form.submit({
                        success: function (form, action) {
                            info.setVisible(false);
                            var object = Ext.decode(action.response.responseText);
                            var data = Ext.decode(object.data);
                            var panel = Ext.create("Ext.panel.Panel", data);
                            basicPanelHome.removeAll();
                            basicPanelHome.add(panel);
                        },

                        failure: function (form, action) {
                            var object = Ext.decode(action.response.responseText);
                            var panel = Ext.create("Ext.panel.Panel", object.data);
                            info.setText(object.data);
                            info.setVisible(true);
                        }
                    });
                }
            }
        }
    ]
});

var basicPanelHome = Ext.create("Ext.panel.Panel", {
    title: 'Дом',
    layout: 'border',
    items: [
        panelLogin,
    ]
});