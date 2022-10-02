Ext.define('mds.view.clientFileManager.EditFolderWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.editFolderWindow',
    title: 'Folder Details',
    modal: true,
    resizable: true,
    layout: 'hbox',
    height: 140,
    width: 400,

    initComponent: function(){
        var me=this;

        Ext.applyIf(me, {

            border: false,
            bodyPadding: 10,

            items: [{
                xtype: 'fieldcontainer',
                defaultType: 'textfield',
                width: 330,
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                defaults: {
                    margins: '0 0 10 0'
                },
                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 100
                },
                items: [{
                    name: 'folderName',
                    id: 'editFolderNameField',
                    fieldLabel: 'Folder name',
                    allowBlank: false,
                    readOnly: true
                }]
            }],

            buttons: [{
                text: 'OK',
                id: 'cancelEditFolder'
            }]
        });

        me.callParent(arguments);
    }

});
