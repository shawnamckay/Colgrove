
Ext.define('mds.view.clientPhotoList.widget.ChooseFileWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.chooseFileWindow',
    title: 'Choose photo',
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
                            id: 'choosePhotoUpload',
                            title: 'Upload new photo',
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


