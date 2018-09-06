var basicUrl = getUrl('http://localhost:8080/', 'https://prog-tools.ru:8445/');
var urlAuthorizationAndPanel = basicUrl + 'home/rest/admin/panel';

var panelLogin = Ext.create("Ext.form.Panel", {
    id: 'panelLogin',
    layout: 'vbox',
    region: 'center',
    width: 200,
    height: 400,
    layout: {
        type: 'vbox',
        align: 'center',
        pack:'center'
    },
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
            xtype: 'button',
            text: 'Войти',
            handler: function () {
                Ext.Ajax.request({
                    url: urlAuthorizationAndPanel,
                    timeout: 60000,
                    method: 'GET',
                    success: function (response) {
                        console.log(response);
                        var object = Ext.decode(response.responseText);
                        console.log(object);
                        var data = Ext.decode(object.data);
                        var panel = Ext.create("Ext.panel.Panel", data);
                        console.log(panel);
                        basicPanelHome.removeAll();
                        basicPanelHome.add(panel);
                    },

                    failure: function (response) {
                        console.log(response);
                    }
                });
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