/**
 * 
 */
Ext.define('mds.view.clientNavigation.ClientNavigator', {
    extend: 'Ext.container.Container',
    requires:['mds.view.clientNavigation.ProjectBreadcrumb'],
    alias: 'widget.clientNavigatior',
    id: 'clientNavigatior',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    items: [
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            items: [
                {xtype: 'globalHome'},
                {xtype: 'projectBreadcrumb'},
                {xtype: 'navigationLogo', id: 'clientNavigatorCompanyImage'},
                {xtype: 'navigationLogo', id: 'clientNavigatorProjectImage'},
                {xtype: 'container', flex: 1}
            ]
        },
        {
            xtype: 'navigationBar'
        }
    ],
    initComponent: function() {
        var me = this;
        me.callParent(arguments);
    }
});