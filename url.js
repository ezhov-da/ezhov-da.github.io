var basicPanelUrl = Ext.create('Ext.panel.Panel', {
		 	title: 'Кодирование URL параметров для GET запроса',
			layout: 'border',
			items: [
				{
					xtype: 'panel',
					title: 'Входные данные',
					region: 'center',
					layout: {
							type: 'vbox',
							align: 'stretch'
						},
					height: '100%',
					items:[
						{
							xtype: 'textfield',
							labelAlign: 'top',
							fieldLabel: 'HTTP ссылка:',
							emptyText: 'HTTP ссылка',
							id: 'httpLink',
							width: '100%',
						},
						{
							xtype: 'panel',
							border: false,
							layout: 'fit',
							flex: 1,
							items: [
								{
									xtype: 'textarea',
									labelAlign: 'top',
									fieldLabel: 'Названия параметров в столбик:',
									emptyText: 'Названия параметров в столбик',
									id: 'params',
								}
							]
						},
						{
							xtype: 'panel',
							layout: 'fit',
							border: false,
							flex: 1,
							items: [
								{
									xtype: 'textarea',
									labelAlign: 'top',
									fieldLabel: 'Значения параметров в столбик:',
									emptyText: 'Значения параметров в столбик',
									id: 'values',
								}
							]
						},
						{
							xtype: 'button',
							text: 'Выполнить',
							handler: function() {
								var url = Ext.getCmp('httpLink').getValue();
								var params = Ext.getCmp('params').getValue();
								var values = Ext.getCmp('values').getValue();
								var resultCmp = Ext.getCmp('result');
								console.log(url + " - " + url);
								console.log(params + ":\n" + params);
								console.log(params + ":\n" + values);
								var splitParams = params.split('\n');
								var splitValues = values.split('\n');
								var paramsObject = {};
								for(var i = 0; i < splitParams.length; i++){
									console.log("iterate: " + splitParams[i]);
									console.log("iterate: " + splitValues[i]);
									paramsObject[splitParams[i]] = splitValues[i];
								}
								console.log("Параметры:");
								console.log(paramsObject);
								var paramsAfterEncoding = Ext.Object.toQueryString(paramsObject);
								resultCmp.setValue(url + paramsAfterEncoding);
							}
						}
					]
				},
				{
					xtype: 'panel',
					title: 'Результат',
					region: 'south',
					split: true,
					layout: 'fit',
					height: '40%',
					items:[
						{
							xtype: 'textarea',
							width: '100%',
							flex: 1,
							id: 'result',
						}
					]
				}
			]
		});
