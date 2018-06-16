Ext.Ajax.useDefaultXhrHeader = false;

Ext.application({
    name: 'Gists',
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                Ext.create('Ext.tab.Panel', {
                    renderTo: document.body,
                    items: [
                        basicPanelGist,
                        basicPanelVba
                    ]
                })
            ]
        })
        ;
    }
});