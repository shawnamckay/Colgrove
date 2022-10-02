/**
 * 
 */
Ext.define('mds.view.clientDashboard.GlobalPlusViewFloorplansOrPhotos', {
    extend: 'Ext.form.Panel',
    alias: 'widget.globalPlusViewFloorplansOrPhotos',
    id: 'globalPlusViewFloorplansOrPhotos',
    initComponent: function() {
        var me = this;
        me.my.store = Ext.getStore('clientDashboard.FloorplansOrPhotoses');
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
            fieldLabel: 'Floorplans Or Photos',
            defaultType: 'radiofield',
            defaults: {
                flex: 1,
                name: 'FloorplansOrPhotos'
            },
            allowBlank: false,
            bubbleEvents: ['change'],
            items: [
                {
                    boxLabel: 'Floorplans',
                    inputValue: 'floorplans'
                },
                {
                    boxLabel: 'Photos',
                    inputValue: 'photos'
                }
            ],
            layout: 'vbox'
        }
    ],
    my: {}
});