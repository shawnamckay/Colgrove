/**
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalPlusViewNavigationBarPreference', {
    extend: 'Ext.form.Panel',
    alias: 'widget.globalPlusViewNavigationBarPreference',
    id: 'globalPlusViewNavigationBarPreference',
    initComponent: function() {
        var me = this;
        me.my.store = mds.app.getStore('clientNavigation.Preferences');
        me.callParent(arguments);
    },
    listeners: {
        render: function() {
            var me = this;
            me.my.store.load({
                callback: function() {
                    me.getForm().loadRecord(me.my.store.getAt(0));
                }
            });
        },
        change: function(that, newValue, oldValue, eOpts) {
            var me = this;
            // avoid syncing on the first time and after returning from the previous sync.
            if (me.my.initialized && me.my.initialized == true) {
                me.getRecord().set(newValue);
                me.my.store.sync({
                    callback: function (batch, options) {
                        me.getForm().loadRecord(me.my.store.getAt(0));
                    }
                });
                me.my.initialized = false;
            } else {
                me.my.initialized = true;
            }
        }
    },
    items: [
        {
            xtype: 'label',
            text: ' '
        },
        {
            xtype: 'radiogroup',
            fieldLabel: 'Navigation Bar Preference',
            defaultType: 'radiofield',
            defaults: {
                flex: 1,
                name: 'MemberDashboardPreference'
            },
            allowBlank: false,
            bubbleEvents: ['change'],
            items: [
                {
                    boxLabel: 'Global Feed',
                    inputValue: 'globalfeed'
                },
                {
                    boxLabel: 'Map Viewer',
                    inputValue: 'mapviewer'
                },
                {
                    boxLabel: 'My Favorites',
                    inputValue: 'globalfavourites'
                },
                {
                    boxLabel: 'My Webcams',
                    inputValue: 'globalwebcams'
                }
            ],
            layout: 'vbox'
        }
    ],
    my: {}
});