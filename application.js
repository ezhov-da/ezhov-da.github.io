Ext.Ajax.useDefaultXhrHeader = false;
Ext.Ajax.cors = false;
Ext.Ajax.withCredentials = false;
Ext.Ajax.timeout = 600000;

Ext.application({
    name: 'Tools',
    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                Ext.create('Ext.tab.Panel', {
                    renderTo: document.body,
                    items: [
                        basicPanelGist,
                        basicLibraryPanel,
                        basicPanelVba,
                        basicPanelUrl,
                        basicPanelHome
                    ]
                })
            ]
        })
        ;
    }
});
