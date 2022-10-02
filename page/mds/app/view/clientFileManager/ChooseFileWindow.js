
Ext.define('mds.view.clientFileManager.ChooseFileWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.chooseFileWindow',
    title: 'Choose file',
    modal: true,
    uploadConfig: {},

    resizable: true,
    layout: 'fit',
    height: 250,
    width: 500,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'tabpanel',
                    activeTab: 0,
                    items: [
                        {
                            xtype: 'uploadPanel',
                            id: 'chooseFileUpload',
                            title: 'Upload new file',
                            uploadConfig: me.uploadConfig,
                            autoScroll: true
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);
    }

});


