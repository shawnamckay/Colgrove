/**
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalPlusView', {
    extend: 'Ext.container.Container',
    alias: 'widget.globalPlusView',
    id: 'globalPlusView',
    items: [
        {
            xtype: 'label',
            text: 'Plus'
        },
        {
            xtype: 'globalPlusViewAnother'
        },
        {
            xtype: 'globalPlusViewFloorplansOrPhotos'
        }
        /*
        {
            xtype: 'globalPlusViewNavigationBarPreference',
        }
        */
    ],
    setSelectionModel: function(model) { //using a non related MODEL and VIEW for now. ;)
        var me = this;
        var theCls = 'backgroundGrey';
        var i = 0;
        if (!me.my.cmps) {
            me.my.cmps = [
                Ext.getCmp('globalPlusViewNavigationBarPreference'),
                Ext.getCmp('globalPlusViewFloorplansOrPhotos'),
                Ext.getCmp('globalPlusViewAnother')
            ];
        }
        for (i = 0; i < me.my.cmps.length; i++) {
            me.my.cmps[i].removeBodyCls(theCls);
        }
        if (model.ProjectUID === 'globalPlusViewNavigationBarPreference') {
            me.my.cmps[0].addBodyCls(theCls);
        } else if (model.ProjectUID === 'globalPlusViewFloorplansOrPhotos') {
            me.my.cmps[1].addBodyCls(theCls);
        } else if (model.ProjectUID === 'globalPlusViewAnother') {
            me.my.cmps[2].addBodyCls(theCls);
        }
    },
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    },
    my: {}
});